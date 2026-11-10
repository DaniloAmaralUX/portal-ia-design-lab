import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { CraftProvider } from "@/components/craft/CraftProvider";
import { router } from "@/router";
import "@/styles/globals.css";
import "@/styles/chanhdai-portal.css";
document.documentElement.classList.add("chanhdai-preset");

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root element.");

const draw = () =>
  createRoot(root).render(
    <StrictMode>
      <CraftProvider>
      <RouterProvider router={router} />
      </CraftProvider>
    </StrictMode>,
  );

// React draws the first page once the router has it, and the skeleton of index.html stays until then: drawn before, the router
// has nothing to show while the page loads, and a slow phone shows a blank frame. A load that fails draws too: the router shows the
// error on its own page.
void router.load().then(draw, draw);
