// 3D Visualizations for Theory of Computation using Three.js

class TOCVisualizer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        this.currentTopic = null;
        this.objects = [];
        
        // Initialize the visualizer
        this.init();
    }
    
    init() {
        // Get container dimensions
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);
        this.scene.fog = new THREE.Fog(0x0a0a1a, 15, 30);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 15);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-5, -5, -5);
        this.scene.add(backLight);
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Start animation loop
        this.animate();
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    loadVisualization(topic) {
        this.currentTopic = topic;
        this.clearScene();
        
        switch(topic) {
            case 'language-grammar':
                this.createGrammarVisualization();
                break;
            case 'parse-tree':
                this.createParseTreeVisualization();
                break;
            case 'fsa':
                this.createFSAVisualization();
                break;
            case 'pda':
                this.createPDAVisualization();
                break;
            case 'turing-machine':
                this.createTuringMachineVisualization();
                break;
            case 'pumping-lemma':
                this.createPumpingLemmaVisualization();
                break;
            case 'cryptography':
                this.createCryptographyVisualization();
                break;
            default:
                this.createDefaultVisualization();
        }
    }
    
    clearScene() {
        // Remove all objects from the scene
        while(this.scene.children.length > 0) { 
            const object = this.scene.children[0];
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        }
        
        // Clear objects array
        this.objects = [];
        
        // Re-add essential elements
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-5, -5, -5);
        this.scene.add(backLight);
    }
    
    createGrammarVisualization() {
        // Create Chomsky hierarchy visualization
        const levels = [
            { name: "Type 0\nRecursively Enumerable", color: 0xff6b6b, size: 1.8, y: 5 },
            { name: "Type 1\nContext Sensitive", color: 0x4ecdc4, size: 1.5, y: 2.5 },
            { name: "Type 2\nContext Free", color: 0x45b7d1, size: 1.2, y: 0 },
            { name: "Type 3\nRegular", color: 0xfeca57, size: 0.9, y: -2.5 }
        ];
        
        // Add title
        this.createTextLabel("Chomsky Hierarchy", new THREE.Vector3(0, 7, 0), 0xffffff, 1.2);
        
        levels.forEach((level, index) => {
            // Create sphere
            const geometry = new THREE.SphereGeometry(level.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: level.color,
                transparent: true,
                opacity: 0.9,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.y = level.y;
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            this.scene.add(sphere);
            this.objects.push(sphere);
            
            // Create label
            this.createTextLabel(level.name, new THREE.Vector3(0, level.y - level.size - 0.5, 0), level.color, 0.7);
            
            // Add connecting lines
            if (index < levels.length - 1) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, level.y - level.size, 0),
                    new THREE.Vector3(0, levels[index + 1].y + levels[index + 1].size, 0)
                ]);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(line);
                this.objects.push(line);
            }
        });
        
        // Add example languages
        const examples = [
            { text: "Turing Machines", pos: new THREE.Vector3(3, 5, 0), color: 0xff6b6b },
            { text: "C++/Java", pos: new THREE.Vector3(3, 2.5, 0), color: 0x4ecdc4 },
            { text: "HTML/XML", pos: new THREE.Vector3(3, 0, 0), color: 0x45b7d1 },
            { text: "Regular Expressions", pos: new THREE.Vector3(3, -2.5, 0), color: 0xfeca57 }
        ];
        
        examples.forEach(example => {
            this.createTextLabel(example.text, example.pos, example.color, 0.5);
        });
    }
    
    createParseTreeVisualization() {
        // Add title
        this.createTextLabel("Parse Tree Example", new THREE.Vector3(0, 5, 0), 0xffffff, 1.0);
        this.createTextLabel("Expression: id + id * id", new THREE.Vector3(0, 4, 0), 0x4cc9f0, 0.7);
        
        // Create nodes
        const nodes = [];
        const nodeData = [
            { id: 'E', pos: new THREE.Vector3(0, 3, 0), color: 0x96ceb4 },
            { id: 'E', pos: new THREE.Vector3(-2, 1, 0), color: 0x96ceb4 },
            { id: '+', pos: new THREE.Vector3(0, 1, 0), color: 0xfeca57 },
            { id: 'T', pos: new THREE.Vector3(2, 1, 0), color: 0x96ceb4 },
            { id: 'id', pos: new THREE.Vector3(-3, -1, 0), color: 0x45b7d1 },
            { id: '*', pos: new THREE.Vector3(-1, -1, 0), color: 0xfeca57 },
            { id: 'id', pos: new THREE.Vector3(1, -1, 0), color: 0x45b7d1 },
            { id: 'id', pos: new THREE.Vector3(3, -1, 0), color: 0x45b7d1 }
        ];
        
        // Create node spheres
        nodeData.forEach(node => {
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: node.color,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(node.pos);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            this.scene.add(sphere);
            this.objects.push(sphere);
            nodes.push({ object: sphere, data: node });
            
            // Add label
            this.createTextLabel(node.id, node.pos.clone().add(new THREE.Vector3(0, 0.8, 0)), 0xffffff, 0.6);
        });
        
        // Create connections
        const connections = [
            [0, 1], [0, 2], [0, 3], // E -> E, +, T
            [1, 4], [1, 5], [1, 6], // E -> id, *, id
            [3, 7] // T -> id
        ];
        
        connections.forEach(conn => {
            const start = nodeData[conn[0]].pos;
            const end = nodeData[conn[1]].pos;
            
            // Create curved lines for better visualization
            const midHeight = 0.8;
            const curve = new THREE.QuadraticBezierCurve3(
                start,
                new THREE.Vector3(
                    (start.x + end.x) / 2,
                    Math.max(start.y, end.y) + midHeight,
                    (start.z + end.z) / 2
                ),
                end
            );
            
            const points = curve.getPoints(20);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.scene.add(line);
            this.objects.push(line);
        });
    }
    
    createFSAVisualization() {
        // Add title
        this.createTextLabel("Finite State Automaton", new THREE.Vector3(0, 5, 0), 0xffffff, 1.0);
        this.createTextLabel("Binary String Ending with '1'", new THREE.Vector3(0, 4, 0), 0x4cc9f0, 0.7);
        
        // Create states
        const stateData = [
            { name: 'q₀', pos: new THREE.Vector3(-3, 0, 0), isStart: true, isAccepting: false, color: 0xff6b6b },
            { name: 'q₁', pos: new THREE.Vector3(3, 0, 0), isStart: false, isAccepting: true, color: 0x4ecdc4 }
        ];
        
        const states = [];
        
        // Create state spheres
        stateData.forEach(state => {
            const geometry = new THREE.SphereGeometry(1.0, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: state.color,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(state.pos);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            this.scene.add(sphere);
            this.objects.push(sphere);
            
            // Add outer ring for accepting states
            if (state.isAccepting) {
                const ringGeometry = new THREE.RingGeometry(1.1, 1.3, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x4ecdc4,
                    side: THREE.DoubleSide
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.copy(state.pos);
                ring.rotation.x = Math.PI / 2;
                this.scene.add(ring);
                this.objects.push(ring);
            }
            
            // Add label
            this.createTextLabel(state.name, state.pos.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xffffff, 0.8);
            
            states.push({ object: sphere, data: state });
        });
        
        // Create transitions
        const transitions = [
            { from: 0, to: 0, label: '0', curve: true },
            { from: 0, to: 1, label: '1', curve: false },
            { from: 1, to: 0, label: '0', curve: false },
            { from: 1, to: 1, label: '1', curve: true }
        ];
        
        transitions.forEach(transition => {
            const fromPos = stateData[transition.from].pos;
            const toPos = stateData[transition.to].pos;
            
            if (transition.curve) {
                // Create curved transition
                const midHeight = 2.5;
                const curve = new THREE.QuadraticBezierCurve3(
                    fromPos,
                    new THREE.Vector3(
                        (fromPos.x + toPos.x) / 2,
                        Math.max(fromPos.y, toPos.y) + (fromPos === toPos ? midHeight : 0),
                        (fromPos.z + toPos.z) / 2
                    ),
                    toPos
                );
                
                const points = curve.getPoints(20);
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(line);
                this.objects.push(line);
                
                // Add arrow
                const arrowPos = curve.getPoint(0.5);
                const tangent = curve.getTangent(0.5).normalize();
                const arrowHelper = new THREE.ArrowHelper(tangent, arrowPos, 0.5, 0xffff00);
                this.scene.add(arrowHelper);
                this.objects.push(arrowHelper);
            } else {
                // Create straight transition
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([fromPos, toPos]);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.scene.add(line);
                this.objects.push(line);
                
                // Add arrow
                const direction = new THREE.Vector3().subVectors(toPos, fromPos).normalize();
                const arrowPos = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
                const arrowHelper = new THREE.ArrowHelper(direction, arrowPos, 0.5, 0xffff00);
                this.scene.add(arrowHelper);
                this.objects.push(arrowHelper);
            }
            
            // Add transition label
            const midPoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
            if (transition.curve && fromPos === toPos) {
                midPoint.y += 1.5;
            } else if (transition.curve) {
                midPoint.y += 1.0;
            }
            this.createTextLabel(transition.label, midPoint, 0xff9ff3, 0.6);
        });
        
        // Add start arrow
        const startArrow = new THREE.ArrowHelper(
            new THREE.Vector3(-1, 0, 0), 
            new THREE.Vector3(-5, 0, 0), 
            1.5, 
            0x45b7d1
        );
        this.scene.add(startArrow);
        this.objects.push(startArrow);
    }
    
    createPDAVisualization() {
        // Add title
        this.createTextLabel("Pushdown Automaton", new THREE.Vector3(0, 5, 0), 0xffffff, 1.0);
        this.createTextLabel("Language: {aⁿbⁿ | n ≥ 0}", new THREE.Vector3(0, 4, 0), 0x4cc9f0, 0.7);
        
        // Create states
        const stateData = [
            { name: 'q₀', pos: new THREE.Vector3(-2, 0, 0), isStart: true, isAccepting: false, color: 0xff6b6b },
            { name: 'q₁', pos: new THREE.Vector3(0, 0, 0), isStart: false, isAccepting: false, color: 0x96ceb4 },
            { name: 'q₂', pos: new THREE.Vector3(2, 0, 0), isStart: false, isAccepting: true, color: 0x4ecdc4 }
        ];
        
        // Create state spheres
        stateData.forEach(state => {
            const geometry = new THREE.SphereGeometry(0.9, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: state.color,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(state.pos);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            this.scene.add(sphere);
            this.objects.push(sphere);
            
            // Add outer ring for accepting states
            if (state.isAccepting) {
                const ringGeometry = new THREE.RingGeometry(1.0, 1.2, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x4ecdc4,
                    side: THREE.DoubleSide
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.copy(state.pos);
                ring.rotation.x = Math.PI / 2;
                this.scene.add(ring);
                this.objects.push(ring);
            }
            
            // Add label
            this.createTextLabel(state.name, state.pos.clone().add(new THREE.Vector3(0, 1.4, 0)), 0xffffff, 0.7);
        });
        
        // Create stack visualization
        const stackPos = new THREE.Vector3(4.5, -1, 0);
        const stackElements = ['Z₀', 'A', 'A'];
        
        // Stack base
        const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xfeca57 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(stackPos.x, stackPos.y - 0.5, stackPos.z);
        this.scene.add(base);
        this.objects.push(base);
        
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xfeca57,
                shininess: 100
            });
            const block = new THREE.Mesh(geometry, material);
            block.position.set(stackPos.x, stackPos.y + i * 0.6, stackPos.z);
            block.castShadow = true;
            block.receiveShadow = true;
            this.scene.add(block);
            this.objects.push(block);
            
            // Add label
            this.createTextLabel(stackElements[i], 
                new THREE.Vector3(stackPos.x, stackPos.y + i * 0.6, stackPos.z + 0.8), 
                0x000000, 0.5);
        }
        
        // Add stack label
        this.createTextLabel('Stack', new THREE.Vector3(stackPos.x, stackPos.y - 2, stackPos.z), 0xffffff, 0.7);
        
        // Add transitions
        const transitions = [
            { from: 0, to: 0, label: 'a, Z₀ → AZ₀', pos: new THREE.Vector3(-2, 1.5, 0) },
            { from: 0, to: 0, label: 'a, A → AA', pos: new THREE.Vector3(-2, 1, 0) },
            { from: 0, to: 1, label: 'b, A → ε', pos: new THREE.Vector3(-1, 0.5, 0) },
            { from: 1, to: 1, label: 'b, A → ε', pos: new THREE.Vector3(0, 0.5, 0) },
            { from: 1, to: 2, label: 'ε, Z₀ → Z₀', pos: new THREE.Vector3(1, 0.5, 0) }
        ];
        
        // Draw transition lines
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 0, 0)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        this.objects.push(line);
        
        // Add transition labels
        transitions.forEach(transition => {
            this.createTextLabel(transition.label, transition.pos, 0xff9ff3, 0.5);
        });
    }
    
    createTuringMachineVisualization() {
        // Add title
        this.createTextLabel("Turing Machine", new THREE.Vector3(0, 5, 0), 0xffffff, 1.0);
        this.createTextLabel("Palindrome Checker", new THREE.Vector3(0, 4, 0), 0x4cc9f0, 0.7);
        
        // Create tape
        const tapeLength = 9;
        for (let i = 0; i < tapeLength; i++) {
            const isActive = i === Math.floor(tapeLength/2);
            
            // Create tape cell
            const geometry = new THREE.BoxGeometry(1.2, 0.4, 1.2);
            const material = new THREE.MeshPhongMaterial({ 
                color: isActive ? 0xff9ff3 : 0x4ecdc4,
                transparent: true,
                opacity: isActive ? 1 : 0.8,
                shininess: 100
            });
            const cell = new THREE.Mesh(geometry, material);
            cell.position.set(i - Math.floor(tapeLength/2), 1, 0);
            cell.castShadow = true;
            cell.receiveShadow = true;
            this.scene.add(cell);
            this.objects.push(cell);
            
            // Add cell content
            const content = isActive ? 'a' : 'B';
            this.createTextLabel(content, 
                new THREE.Vector3(i - Math.floor(tapeLength/2), 1.5, 0), 
                0x000000, 0.6);
        }
        
        // Create head
        const headGeometry = new THREE.BoxGeometry(1.5, 0.7, 1.5);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            shininess: 100
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 2.5, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        this.scene.add(head);
        this.objects.push(head);
        
        // Add head label
        this.createTextLabel('Read/Write Head', new THREE.Vector3(0, 3.5, 0), 0xffffff, 0.6);
        
        // Create state indicator
        const stateGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const stateMaterial = new THREE.MeshPhongMaterial({ color: 0x45b7d1 });
        const stateSphere = new THREE.Mesh(stateGeometry, stateMaterial);
        stateSphere.position.set(-4, 0, 0);
        this.scene.add(stateSphere);
        this.objects.push(stateSphere);
        
        this.createTextLabel('q₀', new THREE.Vector3(-4, 1.2, 0), 0xffffff, 0.7);
        this.createTextLabel('Current State', new THREE.Vector3(-4, -1, 0), 0xffffff, 0.6);
    }
    
    createPumpingLemmaVisualization() {
        // Add title
        this.createTextLabel("Pumping Lemma", new THREE.Vector3(0, 5, 0), 0xffffff, 1.0);
        this.createTextLabel("For Regular Languages", new THREE.Vector3(0, 4, 0), 0x4cc9f0, 0.7);
        
        // Create string visualization
        const string = 'x y z';
        const positions = [-3, 0, 3];
        const parts = ['x', 'y', 'z'];
        const colors = [0x45b7d1, 0xfeca57, 0x96ceb4];
        
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.BoxGeometry(1.8, 0.8, 0.8);
            const material = new THREE.MeshPhongMaterial({ 
                color: colors[i],
                shininess: 100
            });
            const box = new THREE.Mesh(geometry, material);
            box.position.set(positions[i], 1, 0);
            box.castShadow = true;
            box.receiveShadow = true;
            this.scene.add(box);
            this.objects.push(box);
            
            // Add label
            this.createTextLabel(parts[i], 
                new THREE.Vector3(positions[i], 2, 0), 
                0xffffff, 0.7);
        }
        
        // Show pumped string
        const pumpedPositions = [-4, -2, 0, 2, 4];
        const pumpedParts = ['x', 'y', 'y', 'y', 'z'];
        
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(1.3, 0.6, 0.6);
            const material = new THREE.MeshPhongMaterial({ 
                color: i === 1 || i === 2 || i === 3 ? 0xfeca57 : (i === 0 ? 0x45b7d1 : 0x96ceb4),
                transparent: true,
                opacity: i > 2 ? 0.6 : 1,
                shininess: 100
            });
            const box = new THREE.Mesh(geometry, material);
            box.position.set(pumpedPositions[i], -2, 0);
            box.castShadow = true;
            box.receiveShadow = true;
            this.scene.add(box);
            this.objects.push(box);
            
            // Add label
            this.createTextLabel(pumpedParts[i], 
                new THREE.Vector3(pumpedPositions[i], -3, 0), 
                0xffffff, 0.5);
        }
        
        // Add explanation text
        this.createTextLabel('Original: x y z', new THREE.Vector3(0, 3, 0), 0xffffff, 0.6);
        this.createTextLabel('Pumped: x yⁿ z (n≥0)', new THREE.Vector3(0, -4, 0), 0xffffff, 0.6);
        
        // Add arrows
        const arrow1 = new THREE.ArrowHelper(
            new THREE.Vector3(0, -1, 0), 
            new THREE.Vector3(0, 2.5, 0), 
            1.0, 
            0xffff00
        );
        this.scene.add(arrow1);
        this.objects.push(arrow1);
        
        this.createTextLabel('Pump "y" part', new THREE.Vector3(1, -0.5, 0), 0xffff00, 0.5);
    }
    
    createCryptographyVisualization() {
        // Add title
        this.createTextLabel("Public Key Cryptography", new THREE.Vector3(0, 5, 0), 0xffffff, 1.0);
        this.createTextLabel("RSA Encryption", new THREE.Vector3(0, 4, 0), 0x4cc9f0, 0.7);
        
        // Create public and private key visualization
        const keyPositions = [
            { pos: new THREE.Vector3(-3, 2, 0), label: 'Public Key', color: 0x4ecdc4 },
            { pos: new THREE.Vector3(3, 2, 0), label: 'Private Key', color: 0xff6b6b }
        ];
        
        keyPositions.forEach(key => {
            const geometry = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: key.color,
                shininess: 100
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.copy(key.pos);
            cylinder.rotation.x = Math.PI / 2;
            cylinder.castShadow = true;
            cylinder.receiveShadow = true;
            this.scene.add(cylinder);
            this.objects.push(cylinder);
            
            // Add label
            this.createTextLabel(key.label, key.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xffffff, 0.7);
        });
        
        // Create message flow
        const messageGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const messageMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xfeca57,
            shininess: 100
        });
        const message = new THREE.Mesh(messageGeometry, messageMaterial);
        message.position.set(-3, -1, 0);
        message.castShadow = true;
        message.receiveShadow = true;
        this.scene.add(message);
        this.objects.push(message);
        
        // Add message label
        this.createTextLabel('Plaintext', new THREE.Vector3(-3, -2.2, 0), 0xffffff, 0.6);
        
        // Add encrypted message
        const encryptedGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const encryptedMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x96ceb4,
            shininess: 100
        });
        const encrypted = new THREE.Mesh(encryptedGeometry, encryptedMaterial);
        encrypted.position.set(3, -1, 0);
        encrypted.castShadow = true;
        encrypted.receiveShadow = true;
        this.scene.add(encrypted);
        this.objects.push(encrypted);
        
        // Add encrypted label
        this.createTextLabel('Ciphertext', new THREE.Vector3(3, -2.2, 0), 0xffffff, 0.6);
        
        // Add arrows for flow
        const arrow1 = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0), 
            new THREE.Vector3(-2, -1, 0), 
            1.5, 
            0xffff00
        );
        this.scene.add(arrow1);
        this.objects.push(arrow1);
        
        const arrow2 = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0), 
            new THREE.Vector3(1.5, -1, 0), 
            1.5, 
            0xffff00
        );
        this.scene.add(arrow2);
        this.objects.push(arrow2);
        
        this.createTextLabel('Encrypt with\nPublic Key', new THREE.Vector3(-0.5, -0.5, 0), 0xffff00, 0.5);
        this.createTextLabel('Decrypt with\nPrivate Key', new THREE.Vector3(2, -0.5, 0), 0xffff00, 0.5);
    }
    
    createDefaultVisualization() {
        // Create a simple cube as default visualization
        const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.85,
            shininess: 100
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);
        this.objects.push(cube);
        
        // Add label
        this.createTextLabel('3D Visualization', new THREE.Vector3(0, 3, 0), 0xffffff, 0.8);
        this.createTextLabel('Select a topic to begin', new THREE.Vector3(0, -3, 0), 0xffffff, 0.6);
    }
    
    createTextLabel(text, position, color, size = 0.6) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        // Draw text
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = `Bold ${size * 48}px Arial`;
        context.fillStyle = `#${new THREE.Color(color).getHexString()}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Handle multi-line text
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], canvas.width / 2, canvas.height / 2 + (i - (lines.length - 1) / 2) * (size * 50));
        }
        
        // Create texture and material
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(size * 5, size * 2.5, 1);
        this.scene.add(sprite);
        this.objects.push(sprite);
        
        return sprite;
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Dispose of geometries and materials
        this.clearScene();
    }
}

// Make the class available globally
window.TOCVisualizer = TOCVisualizer;