import { Link } from 'react-router-dom';

const PlaceholderPage = ({ title, isLinked }) => {
  if (!isLinked) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <h1 className="text-2xl font-bold">Not Linked</h1>
        <p className="text-slate-400 max-w-sm">Please link your device in Settings first.</p>
        <Link to="/settings" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
          Go to Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
      </header>
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <p className="text-slate-400">This feature is coming soon to the web version.</p>
        <p className="text-slate-500 text-sm mt-2">Use the Android app for full functionality.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
