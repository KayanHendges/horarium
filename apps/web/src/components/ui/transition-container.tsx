// components/Container.js
import { cn } from "@/lib/utils";
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  useEffect,
  useState,
} from "react";

interface ChildElement extends ComponentPropsWithoutRef<"div"> {}

interface ITransitionContainerProps {
  show: boolean;
  children: ReactElement<ChildElement> | ReactElement<ChildElement>[];
  ms?: number;
  onUnmount?: () => void;
}

const TransitionContainer = ({
  show,
  children,
  ms = 300,
  onUnmount,
}: ITransitionContainerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 0); // Start transition immediately
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setIsMounted(false);
        onUnmount && onUnmount();
      }, ms); // Duration should match Tailwind CSS transition duration
      return () => clearTimeout(timeout);
    }
  }, [ms, onUnmount, show]);

  if (!isMounted) return null;

  const elements = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        className: cn(
          child.props.className,
          `transition-opacity duration-[${ms}ms]`,
          isVisible ? "opacity-100" : "opacity-0"
        ),
      });
    }
    return child;
  });

  return elements;
};

export default TransitionContainer;
