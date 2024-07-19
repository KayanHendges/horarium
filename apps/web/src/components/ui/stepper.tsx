import { cn } from "@/lib/utils";
import React, {
  ComponentPropsWithoutRef,
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { Text } from "../typography/text";
import { Button, ButtonProps } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { StepTransition } from "./step-transition";

interface IStepperRootProps extends ComponentPropsWithoutRef<"div"> {}

type StepperNav = "previous" | "next";

interface IStepperContext {
  stepCount: number;
  setStepCount: (count: number) => void;
  handleNav: (nav: StepperNav) => Promise<void>;
  selectedStep: number;
}

const StepperContext = createContext({} as IStepperContext);

interface IStepperRootProps extends ComponentPropsWithoutRef<"div"> {
  stepperState?: [number, React.Dispatch<React.SetStateAction<number>>];
  onFinish?: () => Promise<void>;
}

const StepperRoot = ({
  className,
  children,
  stepperState,
  onFinish,
  ...props
}: IStepperRootProps) => {
  const internalStepState = useState<number>(0);
  const [selectedStep, setSelectedStep] = stepperState || internalStepState;
  const [stepCount, setStepCount] = useState<number>(0);

  const handleNav = async (nav: StepperNav) => {
    if (nav === "previous") {
      if (selectedStep <= 0) return setSelectedStep(0);
      return setSelectedStep(selectedStep - 1);
    }

    if (selectedStep + 1 >= stepCount) {
      if (onFinish) await onFinish();

      return setSelectedStep(stepCount - 1);
    }

    return setSelectedStep(selectedStep + 1);
  };

  return (
    <StepperContext.Provider
      value={{
        stepCount,
        setStepCount,
        selectedStep,
        handleNav,
      }}
    >
      <Card className={cn("flex flex-col", className)} {...props}>
        {children}
      </Card>
    </StepperContext.Provider>
  );
};
StepperRoot.displayName = "Stepper.Root";

interface IStepperProgressBarProps {
  isCompleted?: boolean;
  isSelected?: boolean;
}

const StepperProgressBar = ({
  isCompleted,
  isSelected,
}: IStepperProgressBarProps) => {
  return (
    <div
      className={cn(
        "flex-1 h-[1px] rounded transition-all",
        isSelected
          ? "bg-primary"
          : isCompleted
            ? "bg-muted-foreground"
            : "bg-muted"
      )}
    />
  );
};

interface IStepperHeaderItemProps extends ComponentPropsWithoutRef<"div"> {
  icon?: ReactElement;
  index?: number;
  isCompleted?: boolean;
  isSelected?: boolean;
}

const StepperHeaderItem = ({
  className,
  children,
  icon,
  index = 1,
  isCompleted,
  isSelected,
  ...props
}: IStepperHeaderItemProps) => {
  const stepNumber = index + 1;
  return (
    <div
      className={cn(
        "flex mx-6 flex-col justify-center items-center gap-2",
        className
      )}
      {...props}
    >
      <Text
        className={cn(
          "flex justify-center items-center h-6 w-6 rounded-full transition-all",
          isSelected
            ? "bg-brand text-brand-foreground"
            : isCompleted
              ? "bg-foreground text-background"
              : "bg-muted"
        )}
      >
        {icon || stepNumber}
      </Text>
      <Text
        className={cn(
          "text-center flex-1 text-wrap",
          isSelected ? "text-primary" : "text-muted-foreground"
        )}
      >
        {children}
      </Text>
    </div>
  );
};
StepperHeaderItem.displayName = "Stepper.HeaderItem";

interface IStepperHeaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children:
    | ReactElement<IStepperHeaderItemProps>
    | ReactElement<IStepperHeaderItemProps>[];
}

const StepperHeader = ({
  className,
  children,
  ...props
}: IStepperHeaderProps) => {
  const { setStepCount, selectedStep } = useContext(StepperContext);

  const childrenLength = React.Children.count(children);

  useEffect(() => {
    setStepCount(childrenLength);
  }, [childrenLength, setStepCount]);

  return (
    <CardHeader className={cn("flex-row items-center", className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === StepperHeaderItem) {
          const isCompleted = index <= selectedStep;
          const isSelected = selectedStep === index;
          return (
            <>
              {index > 0 && (
                <StepperProgressBar
                  isCompleted={isCompleted}
                  isSelected={isSelected}
                />
              )}
              {React.cloneElement(child, {
                index,
                isCompleted,
                isSelected,
              })}
            </>
          );
        }
        return child;
      })}
    </CardHeader>
  );
};
StepperHeader.displayName = "Stepper.Header";

interface IStepperContentItemProps
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  handleNextStepSubmit?: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<boolean | undefined | void>;
}

const StepperContentItem = React.forwardRef<
  HTMLFormElement,
  IStepperContentItemProps
>(({ className, children, handleNextStepSubmit, ...props }, ref) => {
  const { handleNav } = useContext(StepperContext);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitSuccess = handleNextStepSubmit
      ? await handleNextStepSubmit(e)
      : true;

    if (!submitSuccess) return;

    await handleNav("next");
  };

  return (
    <form
      className={cn(
        "w-full flex-1 flex justify-center items-center",
        className
      )}
      onSubmit={handleOnSubmit}
      {...props}
      ref={ref}
    >
      {children}
    </form>
  );
});
StepperContentItem.displayName = "Stepper.ContentItem";

interface IStepperContentProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children:
    | ReactElement<IStepperContentItemProps>
    | ReactElement<IStepperContentItemProps>[];
}

const StepperContent = ({
  className,
  children,
  ...props
}: IStepperContentProps) => {
  const { selectedStep } = useContext(StepperContext);

  return (
    <CardContent
      className={cn(
        "w-full flex-1 flex flex-col justify-center items-center",
        className
      )}
      {...props}
    >
      <StepTransition selectedStep={selectedStep}>{children}</StepTransition>
    </CardContent>
  );
};
StepperContent.displayName = "Stepper.Content";

interface IStepperButtonProps extends ButtonProps {
  nav?: StepperNav;
}

const StepperButton = ({ nav = "next", ...props }: IStepperButtonProps) => {
  const { handleNav } = useContext(StepperContext);
  const defaultButtonType = nav === "previous" ? "button" : undefined;

  const handleOnClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (props.onClick) props.onClick(event);

    if (props.type !== "submit") await handleNav(nav);
  };

  return <Button type={defaultButtonType} {...props} onClick={handleOnClick} />;
};
StepperButton.displayName = "Stepper.Button";

export const Stepper = {
  Root: StepperRoot,
  Header: StepperHeader,
  HeaderItem: StepperHeaderItem,
  Content: StepperContent,
  ContentItem: StepperContentItem,
  Button: StepperButton,
};
