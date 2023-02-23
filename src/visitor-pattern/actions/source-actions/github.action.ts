import { CompositeComponent } from "../../compositeComponent";
import { AbstractPipelineVisitor } from "../../visitors/pipelineVisitor";

export class GithubSourceAction extends CompositeComponent {

  constructor(name: string) {
    super(name);
  }

  public override AcceptVisitor(visitor: AbstractPipelineVisitor): void {
    visitor.visitGithub(this);
    super.AcceptVisitor(visitor);
  }

  public override executeAction(): string {
    return `Executing Github Source Action`;
  }
}