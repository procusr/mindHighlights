export function GradientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 opacity-40">
        {[...Array(5)].map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className="absolute transform"
            style={{
              left: `${index * 20 + Math.random() * 10}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 200}px`,
              height: `${Math.random() * 100 + 50}px`,
              backgroundColor: `hsl(${Math.random() * 60 + 30}, 100%, 85%)`,
              opacity: Math.random() * 0.3 + 0.2,
              borderRadius: "50%",
              filter: "blur(20px)",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
        {[...Array(3)].map((_, index) => (
          <div
            key={`line-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className="absolute bg-primary dark:bg-primary-light"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: "2px",
              height: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.2,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white dark:from-gray-900 dark:via-transparent dark:to-gray-900 opacity-60" />
    </div>
  );
}
