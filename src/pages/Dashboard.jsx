import { useStudyData } from '../hooks/useStudyData';
import { format } from 'date-fns';
import { CheckCircle2, Circle, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onToggle }) => {
  const isModule1 = task.moduleOrderIndex === 0;
  
  // Purple for Mod 1, Cyan for Mod 2
  const bgClass = isModule1 ? 'bg-purple-900/20 border-purple-500/30' : 'bg-cyan-900/20 border-cyan-500/30';
  const textClass = isModule1 ? 'text-purple-300' : 'text-cyan-300';
  
  return (
    <div 
      className={`border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition-all hover:scale-[1.01] ${bgClass} ${task.isCompleted ? 'opacity-60' : ''}`}
      onClick={() => onToggle(task.id, task.isCompleted)}
    >
      <button className={`shrink-0 ${task.isCompleted ? 'text-green-400' : 'text-slate-400'}`}>
        {task.isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${textClass}`}>
          {task.moduleName}
        </p>
        <h3 className={`text-base font-semibold truncate ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
          {task.topicTitle}
        </h3>
      </div>
    </div>
  );
};

const Dashboard = ({ isLinked }) => {
  const { tasks, loading, error, toggleTask } = useStudyData(isLinked);

  if (!isLinked) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🐬</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome to Dolphin</h1>
        <p className="text-slate-400 max-w-sm">Please link your device in Settings to sync your study data.</p>
        <Link to="/settings" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
          Go to Settings
        </Link>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading today's tasks...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className="py-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm font-medium">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Today's Focus</h1>
        </div>
      </header>

      {/* Progress Ring / Summary */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1">Daily Goal</h2>
          <p className="text-slate-400 text-sm">{completedCount} of {totalCount} topics completed</p>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-indigo-500 transition-all duration-500 ease-out"
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {Math.round(progressPercent)}%
          </div>
        </div>
      </section>

      {/* Task List */}
      <section className="space-y-3">
        {totalCount === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center flex flex-col items-center">
            <PartyPopper className="w-12 h-12 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold text-slate-200">Rest Day!</h3>
            <p className="text-slate-400 mt-1">No tasks scheduled for today. Take a break!</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} />
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
