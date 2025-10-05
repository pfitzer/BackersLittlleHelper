# Contributing to Backers Little Helper

First off, thank you for considering contributing to Backers Little Helper! It's people like you that make this tool better for the Star Citizen community.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and respectful environment. Please be kind and courteous to others.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what you expected to see**
* **Include screenshots if possible**
* **Specify your OS version and application version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any similar features in other applications if applicable**

### Pull Requests

1. Fork the repository
2. Create a new branch from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following our coding standards
4. Add or update tests as needed
5. Ensure all tests pass:
   ```bash
   npm test
   ```
6. Commit your changes using clear commit messages:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```
7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. Open a Pull Request

## Development Setup

1. Install prerequisites:
   - Node.js (v16 or higher)
   - Rust (v1.90.0 or higher)
   - npm or yarn

2. Clone your fork:
   ```bash
   git clone git@github.com:your-username/BackersLittlleHelper.git
   cd BackersLittleHelper2
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run tauri dev
   ```

## Coding Standards

### JavaScript/Vue

- Use Vue 3 Composition API
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components focused and single-purpose

### Rust

- Follow Rust standard formatting (`cargo fmt`)
- Run Clippy and fix warnings (`cargo clippy`)
- Add documentation comments for public functions
- Handle errors appropriately

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
Add server status feed to home dashboard

- Fetch RSI server status from XML feed
- Display status with color-coded badges
- Add error handling for failed requests

Fixes #123
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage of new code
- Test on multiple platforms if possible (Windows, macOS, Linux)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments to new functions
- Update CONTRIBUTING.md if you change development workflow
- Include inline comments for complex logic

## Translation

If you'd like to add a new language:

1. Add translations to `src/i18n.js`
2. Follow the existing structure for English and German
3. Test all UI components with the new language
4. Update README.md to list the new language

## Questions?

Feel free to open an issue with the label "question" if you have any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.