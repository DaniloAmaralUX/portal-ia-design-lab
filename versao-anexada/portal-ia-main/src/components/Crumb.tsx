import { Link, type LinkComponent } from "@tanstack/react-router";

// A link of the trail goes to an ancestor of the open page, so it is never the current page: exact stops the router from marking it with aria-current.
export const Crumb: LinkComponent<"a"> = (props) => <Link activeOptions={{ exact: true }} {...props} />;
