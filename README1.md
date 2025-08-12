# Learn Theory of Computation

An interactive, visually rich website for learning Theory of Computation concepts with 3D visualizations.

## Project Structure

```
ToC/
├── index.html              # Main landing page
├── README.md               # This file
├── Prompt.txt              # Original project prompt
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # Main JavaScript functionality
├── content/
│   ├── language-grammar.html  # Language and Grammar content
│   ├── parse-tree.html        # Parse Tree and Derivation content
│   ├── fsa.html               # Finite State Automata content
│   ├── pda.html               # Pushdown Automata content
│   ├── turing-machine.html    # Turing Machine content
│   ├── pumping-lemma.html     # Pumping Lemma content
│   └── cryptography.html      # Cryptography content
└── assets/                 # Future directory for images, 3D models, etc.
```

## Features Implemented

1. **Responsive Design**: Works on desktop, tablet, and mobile devices
2. **Interactive UI**: 
   - Chapter cards with hover effects
   - Learning path visualization
   - Mode toggle (Academic/Real-World)
   - Search functionality
3. **Split-screen Layout**: 
   - Content panel on left
   - 3D visualization panel on right
4. **Learning Path**: Structured learning approach with step-by-step guidance
5. **Visual Design**:
   - Modern color scheme with topic-specific colors
   - Smooth animations and transitions
   - Card-based layout for topics
6. **Complete Content Coverage**:
   - All 7 topics from the original prompt
   - Detailed explanations for each topic
   - Real-world analogies
   - Academic problem-solving tips
   - Example problems with solutions

## Learning Path Structure

The website guides learners through Theory of Computation concepts in a logical sequence:

1. **Language and Grammar** - Foundational concepts
2. **Parse Tree and Derivation** - Understanding syntax
3. **Finite State Automata** - Basic computational models
4. **Pushdown Automata** - Adding memory to automata
5. **Turing Machine** - Most powerful computational model
6. **Pumping Lemma** - Proving language properties
7. **Cryptography** - Real-world applications

## How to Use

1. Open `index.html` in a web browser
2. Explore topics through the chapter cards
3. Follow the recommended learning path
4. Toggle between Academic and Real-World modes
5. Use the search function to find specific topics
6. Click "View Details" to see comprehensive content for each topic
7. Select a topic to see its visualization in the 3D panel

## Deployment Instructions

### Local Deployment
1. Clone or download the repository
2. Open `index.html` in any modern web browser
3. No additional setup required - it's a static website

### Web Server Deployment
1. Upload all files to your web server
2. Ensure the directory structure is maintained
3. The website will be accessible via your domain

### GitHub Pages Deployment
1. Create a new repository on GitHub
2. Push all files to the repository
3. Go to repository settings
4. Enable GitHub Pages in the GitHub Pages section
5. Select the main branch as source
6. Your website will be available at `https://[username].github.io/[repository-name]/`

## Technologies Used

- HTML5
- CSS3 (with modern features like Flexbox and Grid)
- Vanilla JavaScript (no frameworks)
- Font Awesome for icons
- Responsive design principles

## Future Development

To fully implement the 3D visualization features, integration with libraries like Three.js would be necessary. This would allow for:
- Interactive 3D models of automata
- Animated state transitions
- Rotatable models for better understanding
- Real-time simulations of computational processes

The current structure provides a solid foundation for adding these advanced features.

## Customization

To customize the website:
1. Modify `css/styles.css` to change colors, fonts, and layouts
2. Update content in the HTML files in the `content/` directory
3. Add new topics by creating new HTML files in the `content/` directory and linking them in `index.html`
4. Enhance JavaScript functionality in `js/main.js`

## Browser Support

The website works on all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Internet Explorer is not supported.