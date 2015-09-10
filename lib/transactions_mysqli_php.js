/**
 * Created with JetBrains PhpStorm.
 * User: georgepipkin
 * Date: 12/9/13
 * Time: 3:09 PM
 * To change this template use File | Settings | File Templates.
 */

// loads all project titles and the associated top-level context id's - mysqli
transaction_get_project_list = "server_mysqli/getProjectList.php";

// loads components for a particular copntext - mysqli
fetch_components_and_events = "server_mysqli/fetchComponentsAndEvents.php";

// inserts a component into a supplied context - mysqli
insert_component = "server_mysqli/insertNewComponent.php";

// saves a component - deleted
save_component ="server_mysqli/saveComponents.php";

// loads a component given an component id - mysqli
load_this_component = "server_mysqli/loadThisComponent.php";

// updates a specified component - mysqli
update_this_component = "server_mysqli/updateComponent.php";

// loads a single specified project - mysqli
get_this_project = "server_mysqli/getProject.php";

// adds a specified connection to the database - mysqli
insert_this_connection = "server_mysqli/insertConnection.php";

// gets the potential events for this component - deleted
fetch_potential_events = "server_mysqli/fetchPotentialEvents.php";

// gets the events relevent to a particular component in a copntext - deleted
get_context_events = "server_mysqli/contextEvents.php";

// associates selected events with a specific component mysqli
save_selected_events = "server_mysqli/saveSelectedEvents.php";

// creates a new project - mysqli
create_new_project = "server_mysqli/createNewProject.php";

// creates a new sub-context - mysqli
insert_new_context = "server_mysqli/insertNewContext.php";

// creates an exit door - mysqli
insert_exit_door = "server_mysqli/insertExitDoor.php";

// returns the exit doors in a context - mysqli
get_context_exits = "server_mysqli/getSubcontextExits.php";

// returns a list of components before the current one in this context - mysqli
get_prior_context_components = "server_mysqli/contextComponents.php";

// returns a list of connections from a component with a given componentId including title and connection id's - mysqli
load_component_connections = "server_mysqli/loadComponentConnections.php";

// returns a list of all 'prior' components along with the associated possible events and where
// a rule has been bound, the state that rule (ie necessary, sufficient etc...) - deleted
context_events_edit = "server_mysqli/contextEventsEdit.php";

// deleted - not used
get_events_and_rules = "server_mysqli/getEventsAndRulesForContext.php";

// mysqli
get_connection_events = "server_mysqli/getConnectionEvents.php";

// mysqli
update_component_position = "server_mysqli/updateComponentPosition.php";

// mysqli
load_subcontext_door = "server_mysqli/loadSubContextDoor.php";

// mysqli
update_subcontext_configuration = "server_mysqli/updateSubContextConfiguration.php";

// checks userId and password for authentication - mysqli
login_check = "server_mysqli/login_check.php";

// loads all project titles and the associated top-level context id's - mysqli
get_user_courses = "server_mysqli/getUserCourses.php";

// loads a fill in the blank component prior to editing
load_fib_elements = "server_mysqli/loadFibElements.php";

//updates a component and replaces all events with new events, removing any rules
update_components_and_events = "server_mysqli/updateComponentAndEvents.php";

// discovers the non-scoring path rules in preceeding components up to go_ahead=0
find_predecessor_paths = "server_mysqli/findPredecessorPaths.php";

// loads components of a context for preview
get_content_from_here = "server_mysqli/getContentFromHere.php";

// processes submissions from preview
var user_submit = "server_mysqli/processLearnerSubmissions.php";

// gets titles and project ids of user collections
var get_user_collections = "server_mysqli/getUserCollections.php";

//gets titles, components and id's of a specified collection (i.e. project)
var get_context_titles = "server_mysqli/getContextTitles.php";

// create a new collection
var create_new_collection = "server_mysqli/createNewCollection.php";

// create folder ub collection
var insert_new_folder = "server_mysqli/insertNewFolder.php";

// loads and shows all components for context
var load_components_for_context = "server_mysqli/loadComponentsForContext.php";

// clones context or components
var clone_context = "server_mysqli/cloneContext.php";

// deletes a component or a context
var delete_context = "server_mysqli/deleteContext.php";

// deletes a path
var delete_connection = "server_mysqli/deleteConnection.php";

// creates a 'default' connection with go ahead = 1 and right answer adding to the answer stack
var insert_default_connection = "server_mysqli/createDefaultConnection.php";

// sets up the links for branch exits
var setup_exit_link = "server_mysqli/updateExitConnections.php";


