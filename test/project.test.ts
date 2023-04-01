import { TeamFactory } from "../src/factory-pattern/team-factory";
import { UserFactory } from "../src/factory-pattern/user-factory";
import { NotificationType, ScrumRole } from "../src/models/enumerations";
import { Pipeline } from "../src/models/pipeline.model";
import { Project } from "../src/models/project.model";
import { Sprint } from "../src/models/sprint.model";
import { User, NotificationPreference } from "../src/models/user.model";

describe("Project", () => {
  let project: Project;
  let productOwner: User;
  let scrumMaster: User;
  let developer: User;
  let leadDeveloper: User;
  let sprint: Sprint;
  let pipeline: Pipeline;

  beforeEach(() => {
    productOwner = new UserFactory().createUser(
      "Erdem",
      "Pekguzel",
      "erdempekguzel@avans.nl",
      "0697513489",
      [],
      ScrumRole.PRODUCT_OWNER
    );
    scrumMaster = new UserFactory().createUser(
      "Erdem",
      "Pekguzel",
      "erdempekguzel@avans.nl",
      "0697513489",
      [],
      ScrumRole.SCRUM_MASTER
    );
    developer = new UserFactory().createUser(
      "Luc",
      "Joosten",
      "lhajoost@avans.nl",
      "0645791584",
      [
        new NotificationPreference(
          NotificationType.EMAIL,
          "lhajoosten@avans.nl"
        ),
      ],
      ScrumRole.DEVELOPER
    );
    leadDeveloper = new UserFactory().createUser(
      "Luc",
      "Joosten",
      "lhajoost@avans.nl",
      "0645791584",
      [
        new NotificationPreference(
          NotificationType.EMAIL,
          "lhajoosten@avans.nl"
        ),
      ],
      ScrumRole.LEAD_DEVELOPER
    );
    const developers = [developer, leadDeveloper];
    const team = TeamFactory.createTeam('Test Team', productOwner, scrumMaster, [developers[1]], [developers[0]])
    project = new Project(
      1,
      "Test Project",
      new Date(),
      new Date(),
      team
    );
    pipeline = new Pipeline("pipelineTest", productOwner, scrumMaster);
    sprint = new Sprint(
      "",
      new Date(),
      new Date(),
      developer,
      productOwner,
      scrumMaster,
      pipeline
    );
  });

  describe("constructor", () => {
    it("should throw an error when an invalid product owner is provided", () => {
      expect(() => {
        new Project(0, "", new Date(), new Date(), scrumMaster, productOwner, []);
      }).toThrowError();
    });

    it("should throw an error when an invalid scrum master is provided", () => {
      expect(() => {
        new Project(0, "", new Date(), new Date(), productOwner, scrumMaster, []);
      }).toThrowError();
    });
  });

  describe("addSprint", () => {
    it("should add a sprint to the project if there is a scrum master", () => {
      project.addSprint(sprint);
      expect(project["_sprints"]).toContain(sprint);
    });

    it("should not add a sprint to the project if there is no scrum master", () => {
      project["_team"]['scrumMaster'] = undefined;
      project.addSprint(sprint);
      expect(project["_sprints"][0]).not.toContainEqual(sprint);
    });
  });

  describe("removeSprint", () => {
    it("should remove a sprint from the project if the current user is a scrum master", () => {
      project["_sprints"] = [sprint];
      project.removeSprint(sprint, project.getScrumMaster());
      expect(project["_sprints"]).not.toContain(sprint);
    });

    it("should throw an error if the current user is not a scrum master", () => {
      project["_sprints"] = [sprint];
      expect(() => project.removeSprint(sprint, developer)).toThrowError(
        "Only the Scrum Master can remove a sprint"
      );
    });

    it("should not remove a sprint from the project if it does not exist", () => {
      const nonExistingSprint = new Sprint(
        "Non-existing Sprint",
        new Date(),
        new Date(),
        developer,
        productOwner,
        scrumMaster,
        pipeline
      );
      project["_sprints"] = [sprint];

      // Act
      project.removeSprint(nonExistingSprint, project.getScrumMaster());

      // Assert
      expect(project["_sprints"]).toContain(sprint);
    });
  });
});
