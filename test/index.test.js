/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
let functions;

//reset the DOM before every test so each test runs independently
beforeEach(() => {
  jest.resetModules();
  document.body.innerHTML = html;
  functions = require("../index.js");
});

// Verify that addElementToDOM adds content to the correct DOM element
test("Verify that addElementToDOM adds content to the correct DOM element", () => {
  functions.addElementToDOM("dynamic-content", "Hello World");
  
  const container = document.getElementById("dynamic-content");
  expect(container.innerHTML).toBe("Hello World");
});

// Verify that removeElementFromDOM removes an existing element from the DOM
test("Verify that removeElementFromDOM removes an existing element from the DOM", () => {
  // First, add an element to remove
  const container = document.getElementById("dynamic-content");
  container.innerHTML = '<div id="delete-me">Temporary Content</div>';
  
  // Verify it exists first
  expect(document.getElementById("delete-me")).not.toBeNull();
  
  // Run the function to remove it
  functions.removeElementFromDOM("delete-me");
  
  // Verify it is gone
  expect(document.getElementById("delete-me")).toBeNull();
});

// Verify that simulateClick updates the DOM with the expected content
test("Verify that simulateClick updates the DOM with the expected content", () => {
  functions.simulateClick("dynamic-content", "Clicked Content!");
  
  const container = document.getElementById("dynamic-content");
  expect(container.innerHTML).toBe("Clicked Content!");
});

// Verify that handleFormSubmit updates the page when the form input contains valid text
test("Verify that handleFormSubmit updates the page when the form input contains valid text", () => {
  const input = document.getElementById("user-input");
  const container = document.getElementById("dynamic-content");
  const errorMsg = document.getElementById("error-message");
  
  // Set up valid input text
  input.value = "Valid Text Submission";
  
  functions.handleFormSubmit("user-form", "dynamic-content");
  
  // checks both content and hidden DOM state
  expect(container.innerHTML).toBe("Valid Text Submission");
  expect(errorMsg.textContent).toBe("");
  expect(errorMsg.classList.contains("hidden")).toBe(true);
});

// Verify that handleFormSubmit displays the error message
test("Verify that handleFormSubmit displays the error message Input cannot be empty when the input is empty", () => {
  const input = document.getElementById("user-input");
  const errorMsg = document.getElementById("error-message");
  
  // Set up empty input
  input.value = "   ";
  
  functions.handleFormSubmit("user-form", "dynamic-content");
  
  // checks both content and visible DOM state
  expect(errorMsg.textContent).toBe("Input cannot be empty");
  expect(errorMsg.classList.contains("hidden")).toBe(false);
});
