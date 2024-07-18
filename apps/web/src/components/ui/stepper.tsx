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
import { Card, CardContent, CardHeader } from "./card";
import { Separator } from "./separator";

interface IStepperRootProps extends ComponentPropsWithoutRef<"div"> {}

interface IStepperContext {
  stepCount: number;
  setStepCount: (count: number) => void;
  selectedStep: number;
  setSelectedStep: (index: number) => void;
  onFinish?: () => Promise<void>;
}

const StepperContext = createContext({} as IStepperContext);

interface IStepperRootProps extends ComponentPropsWithoutRef<"div"> {
  onFinish?: () => Promise<void>;
}

const StepperRoot = ({
  className,
  children,
  onFinish,
  ...props
}: IStepperRootProps) => {
  const [stepCount, setStepCount] = useState<number>(0);
  const [selectedStep, setSelectedStep] = useState<number>(0);

  return (
    <StepperContext.Provider
      value={{
        stepCount,
        setStepCount,
        selectedStep,
        setSelectedStep,
        onFinish,
      }}
    >
      <Card className={cn("flex flex-col", className)} {...props}>
        {children}
      </Card>
    </StepperContext.Provider>
  );
};
StepperRoot.displayName = "Stepper.Root";

interface IStepperHeaderItemProps extends ComponentPropsWithoutRef<"div"> {
  icon?: ReactElement;
  index?: number;
  isSelected?: boolean;
}

const StepperHeaderItem = ({
  className,
  children,
  icon,
  index = 1,
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
          isSelected ? "bg-foreground text-background" : "bg-muted"
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
          // Clone o elemento filho e passe as props dinâmicas
          return (
            <>
              {index > 0 && <Separator className="flex-1" />}
              {React.cloneElement(child, {
                index,
                isSelected: selectedStep === index,
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
  const { selectedStep, stepCount, setSelectedStep, onFinish } =
    useContext(StepperContext);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("aqui");
    e.preventDefault();

    const submitSuccess = handleNextStepSubmit
      ? await handleNextStepSubmit(e)
      : true;

    if (!submitSuccess) return;

    if (selectedStep + 1 >= stepCount) {
      onFinish && (await onFinish());
      return;
    }

    setSelectedStep(selectedStep + 1);
  };

  return (
    <form
      className={cn(
        "w-full flex-1 flex justify-center items-center",
        className
      )}
      onSubmit={(e) => {
        console.log("submit");
        handleOnSubmit(e);
      }}
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
      {React.Children.map(children, (child, index) => {
        if (index != selectedStep) return <></>;
        return child;
      })}
    </CardContent>
  );
};
StepperContent.displayName = "Stepper.Content";

export const Stepper = {
  Root: StepperRoot,
  Header: StepperHeader,
  HeaderItem: StepperHeaderItem,
  Content: StepperContent,
  ContentItem: StepperContentItem,
};
