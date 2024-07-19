import React, { ReactElement, useState } from "react";
import TransitionContainer from "./transition-container";

interface IStepTransitionProps {
  selectedStep: number;
  children: ReactElement | ReactElement[];
  ms?: number;
}

export const StepTransition = ({
  selectedStep,
  children,
  ms = 150,
}: IStepTransitionProps) => {
  const [renderItem, setRenderItem] = useState<number>(selectedStep);

  return (
    <>
      {React.Children.map(children, (child, index) => {
        return (
          <TransitionContainer
            ms={ms}
            show={selectedStep === index && renderItem === index}
            onUnmount={() => setTimeout(() => setRenderItem(selectedStep), 50)}
          >
            {child}
          </TransitionContainer>
        );
      })}
    </>
  );
};
