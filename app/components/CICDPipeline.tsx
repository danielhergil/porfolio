import { useState, useEffect, useRef } from 'react';
import { Rocket, Coffee, Server, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Octokit } from '@octokit/rest';

type DeploymentStatus =
  | 'idle'
  | 'building'
  | 'testing'
  | 'deploying'
  | 'launching'
  | 'done'
  | 'error';

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  DEPLOYMENT_STATUS: 'deploymentStatus',
  DEPLOYMENT_URL: 'deploymentUrl',
  COUNTDOWN: 'countdown',
  WORKFLOW_RUN_ID: 'workflowRunId',
  COUNTDOWN_START_TIME: 'countdownStartTime',
  INPUT_NAME: 'inputName',
};

export default function CICDPipeline() {
  const [inputName, setInputName] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.INPUT_NAME) || ''
  );
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>(
    () => (localStorage.getItem(LOCAL_STORAGE_KEYS.DEPLOYMENT_STATUS) as DeploymentStatus) || 'idle'
  );
  const [deploymentUrl, setDeploymentUrl] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.DEPLOYMENT_URL) || ''
  );
  const [countdown, setCountdown] = useState(
    () => parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.COUNTDOWN) || '300', 10)
  );
  const [error, setError] = useState('');
  const [workflowRunId, setWorkflowRunId] = useState<number | null>(
    () => parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.WORKFLOW_RUN_ID) || 'null', 10)
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval ID

  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
  });

  // Format input into a valid URL-friendly string
  const formatInputForUrl = (input: string) => {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Save deployment state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEPLOYMENT_STATUS, deploymentStatus);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEPLOYMENT_URL, deploymentUrl);
    localStorage.setItem(LOCAL_STORAGE_KEYS.COUNTDOWN, countdown.toString());
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKFLOW_RUN_ID, workflowRunId?.toString() || 'null');
    localStorage.setItem(LOCAL_STORAGE_KEYS.INPUT_NAME, inputName);
  }, [deploymentStatus, deploymentUrl, countdown, workflowRunId, inputName]);

  // Clear local storage and reset state when countdown finishes
  useEffect(() => {
    if (countdown === 0) {
      resetComponent();
    }
  }, [countdown]);

  // Reset the component to its initial state
  const resetComponent = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DEPLOYMENT_STATUS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DEPLOYMENT_URL);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.COUNTDOWN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.WORKFLOW_RUN_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.COUNTDOWN_START_TIME);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.INPUT_NAME);

    setInputName('');
    setDeploymentStatus('idle');
    setDeploymentUrl('');
    setCountdown(300);
    setError('');
    setWorkflowRunId(null);

    deleteDeployment();
  };

  // Start or resume the countdown when the component mounts or deployment is done
  useEffect(() => {
    if (deploymentStatus === 'done') {
      const countdownStartTime = localStorage.getItem(LOCAL_STORAGE_KEYS.COUNTDOWN_START_TIME);
      const startTime = countdownStartTime ? parseInt(countdownStartTime, 10) : Date.now();
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(300 - elapsedTime, 0);

      setCountdown(remainingTime);

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up a new interval
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            resetComponent();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on unmount or when deploymentStatus changes
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [deploymentStatus]);

  // Handle beforeunload event to delete deployment if the user navigates away
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (countdown > 0) {
        deleteDeployment();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [countdown]);

  const mapStepToStatus = (stepName: string): DeploymentStatus => {
    switch (stepName) {
      case 'Checkout repository':
      case 'Set up Node.js':
        return 'building';
      case 'Install dependencies and run tests':
        return 'testing';
      case 'Deploy to Vercel':
      case 'Wait for 10 seconds':
      case 'Record deployment':
        return 'deploying';
      case 'Wait for deployment to be ready':
        return 'launching';
      default:
        return 'idle';
    }
  };

  const fetchLatestWorkflowRun = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await octokit.request('GET /repos/danielhergil/porfolio-pipeline/actions/runs', {
        owner: 'danielhergil',
        repo: 'porfolio-pipeline',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        params: {
          t: timestamp,
        },
      });

      const sortedRuns = response.data.workflow_runs.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      const latestRun = sortedRuns[0];

      if (!latestRun) {
        throw new Error('No workflow runs found.');
      }

      return latestRun;
    } catch (error) {
      console.error('Error fetching the latest workflow run:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!workflowRunId) return;

    const pollWorkflowStatus = async () => {
      try {
        const timestamp = new Date().getTime();

        const { data: run } = await octokit.rest.actions.getWorkflowRun({
          owner: 'danielhergil',
          repo: 'porfolio-pipeline',
          run_id: workflowRunId,
          params: {
            t: timestamp,
          },
        });

        const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
          owner: 'danielhergil',
          repo: 'porfolio-pipeline',
          headers: {
            'If-None-Match': '',
          },
          run_id: workflowRunId,
          params: {
            t: timestamp,
          },
        });

        if (jobs.jobs.length > 0) {
          const job = jobs.jobs[0];

          if (job.status === 'completed') {
            if (job.conclusion === 'success') {
              if (deploymentStatus !== 'done') {
                setDeploymentStatus('done');
                setDeploymentUrl(`https://ephimeral-project-${formatInputForUrl(inputName)}.vercel.app/`);
                localStorage.setItem(LOCAL_STORAGE_KEYS.COUNTDOWN_START_TIME, Date.now().toString());
                startCountdown();
                clearInterval(interval);
              }
            } else {
              setDeploymentStatus('error');
              setError(`Deployment failed. Conclusion: ${job.conclusion}`);
              clearInterval(interval);
            }
            return;
          }

          const steps = job.steps || [];
          const currentStep = steps.find((step) => step.status === 'in_progress') || steps[steps.length - 1];

          if (currentStep) {
            const newStatus = mapStepToStatus(currentStep.name);
            setDeploymentStatus(newStatus);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setDeploymentStatus('error');
        setError(`Failed to fetch deployment status: ${errorMessage}`);
        clearInterval(interval);
      }
    };

    const interval = setInterval(pollWorkflowStatus, 2000);
    return () => clearInterval(interval);
  }, [workflowRunId, inputName, deploymentStatus]);

  const triggerDeployment = async () => {
    try {
      setError('');
      setDeploymentStatus('building');

      const formattedName = formatInputForUrl(inputName);

      await octokit.rest.actions.createWorkflowDispatch({
        owner: 'danielhergil',
        repo: 'porfolio-pipeline',
        workflow_id: 'deploy.yaml',
        ref: 'main',
        inputs: { user_name: formattedName },
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const latestRun = await fetchLatestWorkflowRun();

      setWorkflowRunId(latestRun.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to trigger deployment: ${errorMessage}`);
      setDeploymentStatus('error');
    }
  };

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear previous interval if it exists
    }
  
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          resetComponent();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const deleteDeployment = async () => {
    try {
      await fetch(`https://api.vercel.com/v9/projects/ephimeral-project-${formatInputForUrl(inputName)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Failed to delete deployment: ${errorMessage}`);
    }
  };

  const getStatusIcon = (status: DeploymentStatus, currentStatus: DeploymentStatus) => {
    const isActive = status === currentStatus;
    const isCompleted =
      (status === 'building' && currentStatus !== 'idle' && currentStatus !== 'building') ||
      (status === 'testing' && currentStatus !== 'idle' && currentStatus !== 'building' && currentStatus !== 'testing') ||
      (status === 'deploying' && currentStatus !== 'idle' && currentStatus !== 'building' && currentStatus !== 'testing' && currentStatus !== 'deploying') ||
      (status === 'launching' && currentStatus !== 'idle' && currentStatus !== 'building' && currentStatus !== 'testing' && currentStatus !== 'deploying' && currentStatus !== 'launching') ||
      (status === 'done' && currentStatus === 'done');

    const getIcon = () => {
      switch (status) {
        case 'building':
          return <Rocket className="w-6 h-6" />;
        case 'testing':
          return <Coffee className="w-6 h-6" />;
        case 'deploying':
          return <Server className="w-6 h-6" />;
        case 'launching':
          return <Zap className="w-6 h-6" />;
        default:
          return null;
      }
    };

    const getLabel = () => {
      switch (status) {
        case 'building':
          return 'Build';
        case 'testing':
          return 'Test';
        case 'deploying':
          return 'Deploy';
        case 'launching':
          return 'Launch';
        default:
          return '';
      }
    };

    return (
      <div
        className={`flex flex-col items-center justify-center w-24 h-24 p-4 rounded-full transition-all duration-300 ${
          isActive ? 'bg-blue-600 animate-bounce' : isCompleted ? 'bg-green-600' : 'bg-gray-700'
        }`}
      >
        {getIcon()}
        <span className="text-xs text-white mt-1">{getLabel()}</span>
      </div>
    );
  };

  const getStatusDescription = () => {
    switch (deploymentStatus) {
      case 'idle':
        return 'Enter a name for your deployment and click "Deploy" to start the process.';
      case 'building':
        return 'Your project is being built. This may take a few moments...';
      case 'testing':
        return 'Running tests to ensure everything works as expected...';
      case 'deploying':
        return 'Deploying your project to Vercel...';
      case 'launching':
        return 'Finalizing the deployment and preparing your site for launch...';
      case 'done':
        return 'Deployment successful! Your site is now live.';
      case 'error':
        return 'An error occurred during deployment. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">CI/CD Pipeline Demo</h1>

      <div className="bg-[#2d2d2d] p-6 rounded-lg space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value.slice(0, 20))}
            placeholder="Enter deployment name"
            className="flex-1 p-3 rounded bg-[#1e1e1e] text-white placeholder-gray-500"
            maxLength={20}
            disabled={deploymentStatus !== 'idle'}
          />
          <Button
            onClick={triggerDeployment}
            disabled={!inputName || deploymentStatus !== 'idle'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Deploy
          </Button>
        </div>

        {error && <div className="p-4 bg-red-900/20 rounded text-red-400">{error}</div>}

        { (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-white">
              {getStatusIcon('building', deploymentStatus)}
              {getStatusIcon('testing', deploymentStatus)}
              {getStatusIcon('deploying', deploymentStatus)}
              {getStatusIcon('launching', deploymentStatus)}
            </div>

            <div className="p-4 bg-[#1e1e1e] rounded-lg">
              <p className="text-white">{getStatusDescription()}</p>
            </div>

            {deploymentStatus === 'done' && (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/20 rounded">
                  <p className="text-green-400">
                    Deployment successful! Your site will be available for:
                  </p>
                  <div className="text-2xl font-bold text-green-400 mt-2">5 minutes</div>
                </div>
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-400 hover:text-blue-300 break-all"
                >
                  {deploymentUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}