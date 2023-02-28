import { Pipeline } from "../../../models/pipeline";
import { IObserver } from "../../../observer-pattern/interfaces/IObserver";
import { IPipelineVisitor } from "../../../visitor-pattern/visitors/IPipelineVisitor";
import { IPipelineState } from "../../interface/IPipelineState";
import { PipelineCancelledState } from "./cancelled.state";

export class PipelineDeployState implements IPipelineState {
  constructor(private pipeline: Pipeline, private observers: IObserver[] = []) {
    this.notify("Pipeline executing deployment");
  }

  public subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public notify(message: string): void {
    this.observers.forEach((observer: IObserver) => {
      observer.update(this);
    });
  }

  getName(): string {
    return "Deploy Stage";
  }

  getAction(): string {
    return "Deploying...";
  }

  acceptVisitor(visitor: IPipelineVisitor): void {
    visitor.visit(this);
  }

  onSource(): void {
    this.logMessage();
    throw new Error("Cannot change to Source State from Deploy State");
  }

  onPackage(): void {
    this.logMessage();
    throw new Error("Cannot change to Source State from Deploy State");
  }

  onBuild(): void {
    this.logMessage();
    throw new Error("Cannot change to Build State from Deploy State");
  }

  onTest(): void {
    this.logMessage();
    throw new Error("Cannot change to Test State from Deploy State");
  }

  onAnalyze(): void {
    this.logMessage();
    throw new Error("Cannot change to Analyze State from Deploy State");
  }

  onDeploy(): void {
    this.logMessage();
    throw new Error("Cannot change to Deploy State from Deploy State");
  }
  onCancelled(): void {
    try {
      console.log("Scrum Master Cancelled Pipeline");
      this.pipeline.setState(new PipelineCancelledState(this.pipeline));
    } catch (error) {
      this.notify(JSON.stringify(error));
    }
  }

  private logMessage(): void {
    console.log("Project is deployed");
  }
}
