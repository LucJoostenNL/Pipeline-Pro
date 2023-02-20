import { BacklogItem } from "../../../observer-pattern/models/backlogItem.model";
import { IBacklogItemState } from "../../interface/IBacklogItemState";
import { BacklogDoneState } from "./done.state";
import { BacklogToDoState } from "./toDo.state";

export class BacklogTestedState implements IBacklogItemState {
  private backlogItem: BacklogItem;

  constructor(backlogItem: BacklogItem) {
    this.backlogItem = backlogItem;
  }

  toDo(): void {
    this.backlogItem.setState(new BacklogToDoState(this.backlogItem));
  }

  doing(): void {
    console.log(
      "Cannot move backlog item to the Doing state from Tested state"
    );
    throw new Error("Cannot move backlog item to the Doing from Tested state");
  }

  readyForTesting(): void {
    console.log(
      "Cannot move backlog item to the ReadyForTesting state from Tested state"
    );
    throw new Error(
      "Cannot move backlog item to the ReadyForTesting from Tested state"
    );
  }

  testing(): void {
    console.log(
      "Cannot move backlog item to the Testing state from Tested state"
    );
    throw new Error(
      "Cannot move backlog item to the Testing from Tested state"
    );
  }

  tested(): void {
    console.log(
      "Cannot move backlog item to the Tested state from Tested state"
    );
    throw new Error("Cannot move backlog item to the Tested from Tested state");
  }

  done(): void {
    this.backlogItem.setState(new BacklogDoneState(this.backlogItem));
  }
}