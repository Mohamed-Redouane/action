# TESTING.md

## Running Cypress Tests

### Interactive Mode
Run Cypress in interactive mode to see real-time test execution in the browser:
```bash
npx cypress open
```
1. Select a test file from the Cypress Test Runner.
2. Cypress will execute the tests and display results in the browser.



## Running Jest Tests (Unit Tests)

Remove Dist Folder jknk

4
```bash
 rm -rf dist
 
```


### Run Jest Tests
To execute all Jest tests:
```bash
npm test
```

### Code Coverage for Jest

1. **Enable Coverage**:
   Add the `--coverage` flag to your Jest command:
   ```bash
   npm test -- --coverage
   ```
2. **View Coverage Report**:
   After running the tests, a coverage summary will be displayed in the terminal. Detailed reports can be found in the `coverage/` folder.
   - Open `coverage/index.html` OR `coverage/clover.xml` in a browser to view a detailed HTML report.

---

