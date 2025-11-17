const Loader = ({ message = "Loading, please wait..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      {/* TalkSphere Logo (bouncing) */}
      <img
        src="/assets/logo2.png"
        alt="TalkSphere Logo"
        className="w-20 h-20 animate-bounce"
      />

      {/* Loading Message */}
      <p className="text-lg font-semibold text-blue-600">{message}</p>
    </div>
  );
};

export default Loader;
