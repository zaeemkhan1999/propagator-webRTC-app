import { useInView } from "react-intersection-observer";

interface ViewportBlockProps {
  onEnterViewport: () => void;
};

const Block: React.FC<ViewportBlockProps> = ({ onEnterViewport }) => {

  const { ref } = useInView({
    triggerOnce: false,
    root: null,
    threshold: 0.01,
    onChange: inView => {
      inView && onEnterViewport();
    },
  });

  return <div ref={ref} className="h-10 w-full bg-transparent"></div>;
};

export const ViewportBlock = Block;
