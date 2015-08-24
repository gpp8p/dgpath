/**
 * Created with JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 12/9/13
 * Time: 3:09 PM
 * To change this template use File | Settings | File Templates.
 */

// loads all project titles and the associated top-level context id's
transaction_get_project_list = "server/getProjectList.php";

// loads components for a particular copntext
fetch_components_and_events = "server/fetchComponentsAndEvents.php";

// inserts a component into a supplied context
insert_component = "server/insertNewComponent.php";

// saves a component
save_component ="server/saveComponents.php";

// loads a component given an component id
load_this_component = "server/loadThisComponent.php";

// updates a specified component
update_this_component = "server/updateComponent.php";

// loads a single specified project
get_this_project = "server/getProject.php";

// adds a specified connection to the database
insert_this_connection = "server/insertConnection.php";

// gets the potential events for this component
fetch_potential_events = "server/fetchPotentialEvents.php";

// gets the events relevent to a particular component in a copntext
get_context_events = "server/contextEvents.php";

// associates selected events with a specific component
save_selected_events = "server/saveSelectedEvents.php";

// creates a new project
create_new_project = "server/createNewProject.php";

// creates a new sub-context
insert_new_context = "server/insertNewContext.php";

// creates an exit door
insert_exit_door = "server/insertExitDoor.php";

// returns the exit doors in a context
get_context_exits = "server/getSubcontextExits.php";

// returns a list of components before the current one in this context
get_prior_context_components = "server/contextComponents.php";

// returns a list of connections from a component with a given componentId including title and connection id's
load_component_connections = "server/loadComponentConnections.php";

// returns a list of all 'prior' components along with the associated possible events and where
// a rule has been bound, the state that rule (ie necessary, sufficient etc...)
context_events_edit = "server/contextEventsEdit.php";

get_events_and_rules = "server/getEventsAndRulesForContext.php";

get_connection_events = "server/getConnectionEvents.php";

update_component_position = "server/updateComponentPosition.php";

load_subcontext_door = "server/loadSubContextDoor.php";

update_subcontext_configuration = "server/updateSubContextConfiguration.php";

// checks userId and password for authentication
login_check = "server/login_check.php";

// loads all project titles and the associated top-level context id's
get_user_courses = "server/getUserCourses.php";




