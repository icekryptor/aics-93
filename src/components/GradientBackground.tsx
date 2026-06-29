// Animated greyscale mesh-gradient backdrop (sits behind the grid and content).
export default function GradientBackground() {
  return (
    <div className="grad-bg" aria-hidden>
      <div className="grad-blob grad-a" />
      <div className="grad-blob grad-b" />
      <div className="grad-blob grad-c" />
      <div className="grad-blob grad-d" />
      <div className="grad-blob grad-e" />
      <div className="grad-blob grad-f" />
      <div className="grad-grain" />
    </div>
  );
}
