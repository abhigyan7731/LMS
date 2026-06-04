/**
 * Local Quiz Question Bank — fallback when no AI API key is configured.
 * Contains topic-specific questions at beginner/intermediate/advanced levels.
 * Questions are randomized and shuffled for variety.
 */

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const QUESTION_BANK = {
  'Web Development': [
    { q: 'What does HTML stand for?', d: 'beginner', cat: 'HTML', opts: ['HyperText Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], c: 0 },
    { q: 'Which CSS property is used to change the text color of an element?', d: 'beginner', cat: 'CSS', opts: ['color', 'font-color', 'text-color', 'foreground'], c: 0 },
    { q: 'What is the correct HTML element for inserting a line break?', d: 'beginner', cat: 'HTML', opts: ['<br>', '<lb>', '<break>', '<newline>'], c: 0 },
    { q: 'Which HTML attribute is used to define inline styles?', d: 'beginner', cat: 'HTML', opts: ['style', 'class', 'font', 'styles'], c: 0 },
    { q: 'Which CSS property controls the text size?', d: 'beginner', cat: 'CSS', opts: ['font-size', 'text-size', 'font-style', 'text-style'], c: 0 },
    { q: 'What does CSS stand for?', d: 'beginner', cat: 'CSS', opts: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], c: 0 },
    { q: 'Which JavaScript method is used to select an HTML element by its ID?', d: 'beginner', cat: 'JavaScript', opts: ['document.getElementById()', 'document.getElement()', 'document.querySelector()', 'document.selectById()'], c: 0 },
    { q: 'What is the purpose of the "box-sizing: border-box" CSS property?', d: 'intermediate', cat: 'CSS', opts: ['Includes padding and border in the element\'s total width/height', 'Removes the border from the element', 'Creates a box shadow around the element', 'Sets the element display to block'], c: 0 },
    { q: 'What is the difference between "==" and "===" in JavaScript?', d: 'intermediate', cat: 'JavaScript', opts: ['"===" checks both value and type, "==" only checks value', '"==" checks both value and type', 'They are identical', '"===" is for strings only'], c: 0 },
    { q: 'Which HTTP method is used to send data to a server to create a resource?', d: 'intermediate', cat: 'HTTP', opts: ['POST', 'GET', 'PUT', 'CONNECT'], c: 0 },
    { q: 'What is a closure in JavaScript?', d: 'intermediate', cat: 'JavaScript', opts: ['A function that has access to variables from its outer scope', 'A way to close the browser window', 'A method to end a loop', 'A type of error handling'], c: 0 },
    { q: 'What is the purpose of the "use strict" directive in JavaScript?', d: 'intermediate', cat: 'JavaScript', opts: ['Enables strict mode which catches common coding errors', 'Makes the code run faster', 'Enables new ES6 features', 'Forces the browser to use HTTPS'], c: 0 },
    { q: 'What does the "virtual DOM" refer to in React?', d: 'advanced', cat: 'React', opts: ['A lightweight copy of the actual DOM for efficient updates', 'A cloud-based DOM service', 'A 3D rendering engine', 'The browser\'s built-in DOM optimizer'], c: 0 },
    { q: 'What is the event loop in JavaScript?', d: 'advanced', cat: 'JavaScript', opts: ['A mechanism that handles asynchronous callbacks by monitoring the call stack and callback queue', 'A CSS animation loop', 'A for loop for events', 'A DOM event handler'], c: 0 },
    { q: 'What is CORS and why is it needed?', d: 'advanced', cat: 'HTTP', opts: ['Cross-Origin Resource Sharing — a security mechanism for cross-domain requests', 'Code Optimization and Resource Sharing', 'A JavaScript testing framework', 'A CSS grid layout system'], c: 0 },
    { q: 'What is server-side rendering (SSR) in Next.js?', d: 'advanced', cat: 'Next.js', opts: ['Rendering pages on the server before sending HTML to the client', 'Running JavaScript only on the server', 'A way to style server components', 'Caching static files on the server'], c: 0 },
    { q: 'What is the purpose of a Service Worker in web development?', d: 'advanced', cat: 'PWA', opts: ['A script that runs in the background to enable offline support and push notifications', 'A CSS preprocessor', 'A server-side API framework', 'A JavaScript testing tool'], c: 0 },
  ],
  'AI & Machine Learning': [
    { q: 'What is Machine Learning?', d: 'beginner', cat: 'ML Basics', opts: ['A subset of AI that enables systems to learn from data', 'A programming language', 'A database management system', 'A type of computer hardware'], c: 0 },
    { q: 'What is the purpose of a training dataset?', d: 'beginner', cat: 'ML Basics', opts: ['To teach the model patterns in the data', 'To test the model\'s performance', 'To deploy the model to production', 'To visualize the results'], c: 0 },
    { q: 'What is supervised learning?', d: 'beginner', cat: 'ML Basics', opts: ['Learning from labeled data with known outputs', 'Learning without any data', 'Learning from unlabeled data', 'Learning by trial and error only'], c: 0 },
    { q: 'Which library is most commonly used for Machine Learning in Python?', d: 'beginner', cat: 'Python ML', opts: ['scikit-learn', 'Django', 'Flask', 'Selenium'], c: 0 },
    { q: 'What is overfitting in machine learning?', d: 'intermediate', cat: 'ML Concepts', opts: ['When a model performs well on training data but poorly on new data', 'When a model is too simple', 'When a model takes too long to train', 'When a model runs out of memory'], c: 0 },
    { q: 'What is the difference between classification and regression?', d: 'intermediate', cat: 'ML Concepts', opts: ['Classification predicts categories, regression predicts continuous values', 'They are the same thing', 'Classification is for images only', 'Regression is for text only'], c: 0 },
    { q: 'What is a neural network?', d: 'intermediate', cat: 'Deep Learning', opts: ['A computing system inspired by biological neural networks in the brain', 'A type of internet network', 'A social media platform', 'A database query optimizer'], c: 0 },
    { q: 'What activation function outputs values between 0 and 1?', d: 'intermediate', cat: 'Deep Learning', opts: ['Sigmoid', 'ReLU', 'Tanh', 'Linear'], c: 0 },
    { q: 'What is the vanishing gradient problem?', d: 'advanced', cat: 'Deep Learning', opts: ['When gradients become extremely small during backpropagation in deep networks', 'When the model disappears from memory', 'When training data is lost', 'When the learning rate is too high'], c: 0 },
    { q: 'What is transfer learning?', d: 'advanced', cat: 'Deep Learning', opts: ['Using a pre-trained model as a starting point for a new task', 'Transferring data between databases', 'Moving a model from one computer to another', 'Converting one programming language to another'], c: 0 },
    { q: 'What is the purpose of dropout in neural networks?', d: 'advanced', cat: 'Deep Learning', opts: ['To prevent overfitting by randomly disabling neurons during training', 'To speed up training', 'To increase the number of parameters', 'To reduce the dataset size'], c: 0 },
  ],
  'Data Science': [
    { q: 'What is the primary purpose of data visualization?', d: 'beginner', cat: 'Visualization', opts: ['To communicate data insights in a visual format', 'To make data look pretty', 'To compress data files', 'To encrypt sensitive data'], c: 0 },
    { q: 'Which Python library is most commonly used for data manipulation?', d: 'beginner', cat: 'Python', opts: ['Pandas', 'Pygame', 'Pillow', 'Flask'], c: 0 },
    { q: 'What is a DataFrame in Pandas?', d: 'beginner', cat: 'Python', opts: ['A 2D labeled data structure like a spreadsheet', 'A type of database', 'A plotting function', 'A machine learning model'], c: 0 },
    { q: 'What does SQL stand for?', d: 'beginner', cat: 'SQL', opts: ['Structured Query Language', 'Sequential Query Logic', 'Standard Question Language', 'System Query Lookup'], c: 0 },
    { q: 'What is the difference between the mean and the median?', d: 'intermediate', cat: 'Statistics', opts: ['Mean is the average, median is the middle value', 'They are the same thing', 'Mean is the most frequent value', 'Median is the average'], c: 0 },
    { q: 'What is a p-value in statistics?', d: 'intermediate', cat: 'Statistics', opts: ['The probability of obtaining results as extreme as the observed, assuming the null hypothesis is true', 'The price of a data point', 'The percentage of correct predictions', 'The power of a statistical test'], c: 0 },
    { q: 'What is feature engineering?', d: 'intermediate', cat: 'Data Analysis', opts: ['Creating new features from existing data to improve model performance', 'Building physical features', 'Deleting columns from a dataset', 'Copying data between tables'], c: 0 },
    { q: 'What is the Central Limit Theorem?', d: 'advanced', cat: 'Statistics', opts: ['The sampling distribution of the mean approaches a normal distribution as sample size increases', 'All data is normally distributed', 'The mean always equals the median', 'Large datasets are always accurate'], c: 0 },
    { q: 'What is the difference between correlation and causation?', d: 'advanced', cat: 'Statistics', opts: ['Correlation measures association, causation implies one variable directly affects another', 'They mean the same thing', 'Correlation is stronger than causation', 'Causation can only be measured in experiments'], c: 0 },
    { q: 'What is dimensionality reduction and when would you use it?', d: 'advanced', cat: 'Data Analysis', opts: ['Reducing the number of features while preserving important information — used when there are too many features', 'Making data smaller by deleting rows', 'Converting 3D data to 2D images', 'Removing outliers from a dataset'], c: 0 },
  ],
  'Mobile Development': [
    { q: 'What programming language is primarily used for Android development?', d: 'beginner', cat: 'Android', opts: ['Kotlin (and Java)', 'Python', 'Ruby', 'PHP'], c: 0 },
    { q: 'What is Flutter?', d: 'beginner', cat: 'Flutter', opts: ['A cross-platform UI toolkit by Google for building mobile apps', 'A JavaScript framework', 'A database system', 'A testing tool'], c: 0 },
    { q: 'What language does iOS development primarily use?', d: 'beginner', cat: 'iOS', opts: ['Swift', 'Java', 'C#', 'Python'], c: 0 },
    { q: 'What is React Native?', d: 'beginner', cat: 'React Native', opts: ['A framework for building native mobile apps using JavaScript and React', 'A CSS framework', 'A database management tool', 'A cloud hosting platform'], c: 0 },
    { q: 'What is the purpose of a widget in Flutter?', d: 'intermediate', cat: 'Flutter', opts: ['A building block for the UI — everything displayed is a widget', 'A type of database query', 'A server-side rendering method', 'A testing utility'], c: 0 },
    { q: 'What is the difference between StatefulWidget and StatelessWidget in Flutter?', d: 'intermediate', cat: 'Flutter', opts: ['StatefulWidget can change its state over time, StatelessWidget cannot', 'StatelessWidget is faster', 'StatefulWidget only works on iOS', 'There is no difference'], c: 0 },
    { q: 'What is hot reload in mobile development?', d: 'intermediate', cat: 'Flutter', opts: ['Instantly updating the UI without restarting the app during development', 'Overclocking the CPU', 'A deployment method', 'A caching strategy'], c: 0 },
    { q: 'What is the purpose of state management in mobile apps?', d: 'advanced', cat: 'Architecture', opts: ['Managing and sharing data/state across different parts of the application', 'Managing server deployments', 'Managing database connections', 'Managing user permissions'], c: 0 },
    { q: 'What is the difference between native and hybrid mobile development?', d: 'advanced', cat: 'Architecture', opts: ['Native uses platform-specific tools, hybrid uses a single codebase for multiple platforms', 'They are the same thing', 'Hybrid is always faster', 'Native only works offline'], c: 0 },
    { q: 'What are platform channels in Flutter?', d: 'advanced', cat: 'Flutter', opts: ['A way to communicate between Dart code and native platform-specific code', 'TV channels for watching Flutter tutorials', 'Marketing channels for apps', 'Database connection pools'], c: 0 },
  ],
  'DevOps & Cloud': [
    { q: 'What does CI/CD stand for?', d: 'beginner', cat: 'CI/CD', opts: ['Continuous Integration / Continuous Deployment', 'Computer Interface / Code Design', 'Cloud Infrastructure / Container Delivery', 'Code Integration / Cloud Deployment'], c: 0 },
    { q: 'What is Docker?', d: 'beginner', cat: 'Docker', opts: ['A platform for building and running containerized applications', 'A programming language', 'A cloud provider', 'A version control system'], c: 0 },
    { q: 'What is a container in DevOps?', d: 'beginner', cat: 'Docker', opts: ['A lightweight, standalone package that includes everything needed to run software', 'A physical server', 'A type of database', 'A monitoring tool'], c: 0 },
    { q: 'What is version control?', d: 'beginner', cat: 'Git', opts: ['A system that tracks changes to code over time', 'A way to version documents', 'A deployment tool', 'A testing framework'], c: 0 },
    { q: 'What is Kubernetes?', d: 'intermediate', cat: 'Kubernetes', opts: ['An open-source container orchestration platform', 'A JavaScript framework', 'A cloud storage service', 'A programming language'], c: 0 },
    { q: 'What is the difference between a Docker image and a Docker container?', d: 'intermediate', cat: 'Docker', opts: ['An image is a template, a container is a running instance of that image', 'They are the same thing', 'An image runs on the server, a container runs on the client', 'A container is smaller than an image'], c: 0 },
    { q: 'What is Infrastructure as Code (IaC)?', d: 'intermediate', cat: 'Cloud', opts: ['Managing infrastructure through code rather than manual configuration', 'Writing code inside infrastructure', 'A programming language for servers', 'A type of cloud storage'], c: 0 },
    { q: 'What is a microservices architecture?', d: 'advanced', cat: 'Architecture', opts: ['An approach where an application is composed of small, independent, loosely coupled services', 'A very small application', 'A type of database design', 'A frontend framework'], c: 0 },
    { q: 'What is the purpose of a load balancer?', d: 'advanced', cat: 'Cloud', opts: ['To distribute incoming traffic across multiple servers for reliability and performance', 'To balance the weight of physical servers', 'To reduce electricity costs', 'To compress data'], c: 0 },
    { q: 'What is the 12-factor app methodology?', d: 'advanced', cat: 'Architecture', opts: ['A methodology for building scalable, maintainable SaaS applications', 'A security testing framework with 12 steps', 'A 12-step deployment process', 'A database normalization technique'], c: 0 },
  ],
  'Cybersecurity': [
    { q: 'What is a firewall?', d: 'beginner', cat: 'Network Security', opts: ['A system that monitors and controls incoming/outgoing network traffic', 'A piece of hardware that prevents fires', 'An antivirus program', 'A backup system'], c: 0 },
    { q: 'What does HTTPS stand for?', d: 'beginner', cat: 'Web Security', opts: ['HyperText Transfer Protocol Secure', 'High Tech Transfer Protocol System', 'Hyper Terminal Transfer Protocol Server', 'Home Transfer Protocol Secure'], c: 0 },
    { q: 'What is phishing?', d: 'beginner', cat: 'Social Engineering', opts: ['A fraudulent attempt to obtain sensitive information by pretending to be a trustworthy entity', 'A type of fishing sport', 'A network scanning tool', 'A data compression method'], c: 0 },
    { q: 'What is encryption?', d: 'beginner', cat: 'Cryptography', opts: ['Converting data into a coded form to prevent unauthorized access', 'Deleting files permanently', 'Compressing files to save space', 'Backing up data to the cloud'], c: 0 },
    { q: 'What is a SQL injection attack?', d: 'intermediate', cat: 'Web Security', opts: ['Inserting malicious SQL code into queries through user input', 'A way to optimize SQL queries', 'A database backup method', 'A type of database index'], c: 0 },
    { q: 'What is the difference between symmetric and asymmetric encryption?', d: 'intermediate', cat: 'Cryptography', opts: ['Symmetric uses one key for both encryption/decryption, asymmetric uses a public/private key pair', 'They are the same thing', 'Symmetric is only for files', 'Asymmetric is faster'], c: 0 },
    { q: 'What is a Man-in-the-Middle (MITM) attack?', d: 'intermediate', cat: 'Network Security', opts: ['An attack where the attacker secretly intercepts communication between two parties', 'A team management strategy', 'A load balancing technique', 'A type of firewall'], c: 0 },
    { q: 'What is a zero-day vulnerability?', d: 'advanced', cat: 'Security', opts: ['A security flaw that is unknown to the vendor and has no available patch', 'A bug that was fixed on day zero', 'A vulnerability that only lasts for one day', 'A scheduled maintenance window'], c: 0 },
    { q: 'What is the OWASP Top 10?', d: 'advanced', cat: 'Web Security', opts: ['A list of the ten most critical web application security risks', 'A top 10 programming language list', 'A ranking of cloud providers', 'A list of best databases'], c: 0 },
    { q: 'What is penetration testing?', d: 'advanced', cat: 'Ethical Hacking', opts: ['Authorized simulated attacks on a system to find security vulnerabilities', 'Testing network speed', 'Testing user interfaces', 'Testing database performance'], c: 0 },
  ],
  'Data Structures & Algorithms': [
    { q: 'What is an array?', d: 'beginner', cat: 'Data Structures', opts: ['A collection of elements stored at contiguous memory locations', 'A type of loop', 'A database table', 'A function'], c: 0 },
    { q: 'What is the time complexity of accessing an element in an array by index?', d: 'beginner', cat: 'Complexity', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], c: 0 },
    { q: 'What is a stack data structure?', d: 'beginner', cat: 'Data Structures', opts: ['A LIFO (Last In, First Out) data structure', 'A FIFO data structure', 'A sorted list', 'A type of tree'], c: 0 },
    { q: 'What is a linked list?', d: 'beginner', cat: 'Data Structures', opts: ['A linear data structure where elements point to the next element', 'An array with links', 'A type of database', 'A sorting algorithm'], c: 0 },
    { q: 'What is the time complexity of binary search?', d: 'intermediate', cat: 'Algorithms', opts: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], c: 0 },
    { q: 'What is a hash table?', d: 'intermediate', cat: 'Data Structures', opts: ['A data structure that maps keys to values using a hash function', 'A type of sorting algorithm', 'A graphical user interface element', 'A database table'], c: 0 },
    { q: 'What is the difference between BFS and DFS?', d: 'intermediate', cat: 'Graph Algorithms', opts: ['BFS explores level by level, DFS explores as deep as possible first', 'They are the same', 'BFS is for trees, DFS is for graphs', 'DFS is always faster'], c: 0 },
    { q: 'What is dynamic programming?', d: 'advanced', cat: 'Algorithms', opts: ['An optimization technique that solves complex problems by breaking them into overlapping subproblems', 'Programming that changes at runtime', 'A type of functional programming', 'Object-oriented programming in Python'], c: 0 },
    { q: 'What is the time complexity of merge sort?', d: 'advanced', cat: 'Sorting', opts: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], c: 0 },
    { q: 'What is an AVL tree?', d: 'advanced', cat: 'Data Structures', opts: ['A self-balancing binary search tree where the height difference of subtrees is at most 1', 'An antivirus log tree', 'A tree that can only have 2 levels', 'A tree used only for strings'], c: 0 },
  ],
  'UI/UX Design': [
    { q: 'What does UX stand for?', d: 'beginner', cat: 'UX Basics', opts: ['User Experience', 'Universal Exchange', 'User Extension', 'Unified Execution'], c: 0 },
    { q: 'What is the purpose of a wireframe?', d: 'beginner', cat: 'Design Process', opts: ['A basic visual guide showing the layout and structure of a page', 'A final polished design', 'A type of animation', 'A coding template'], c: 0 },
    { q: 'What is a prototype in UX design?', d: 'beginner', cat: 'Design Process', opts: ['An interactive simulation of the final product used for testing', 'The final shipped product', 'A type of font', 'A color palette'], c: 0 },
    { q: 'What is responsive design?', d: 'beginner', cat: 'UI Design', opts: ['Design that adapts to different screen sizes and devices', 'Design that responds to user clicks', 'Fast-loading design', 'Design with animations'], c: 0 },
    { q: 'What is Gestalt principle in design?', d: 'intermediate', cat: 'Design Theory', opts: ['Principles describing how humans perceive visual elements as organized patterns', 'A German design tool', 'A type of grid system', 'A color theory model'], c: 0 },
    { q: 'What is the F-pattern in web design?', d: 'intermediate', cat: 'UX Research', opts: ['A common eye-tracking pattern where users scan in an F-shaped pattern', 'A CSS layout method', 'A font family', 'A framework for design systems'], c: 0 },
    { q: 'What is a design system?', d: 'intermediate', cat: 'Design Systems', opts: ['A collection of reusable components and design guidelines for consistent UI', 'An operating system for designers', 'A color wheel', 'A prototyping tool'], c: 0 },
    { q: 'What is cognitive load in UX?', d: 'advanced', cat: 'UX Research', opts: ['The total mental effort required to use an interface', 'The weight of a device', 'The file size of a design', 'The number of pages in a site'], c: 0 },
    { q: 'What is the difference between accessibility and usability?', d: 'advanced', cat: 'Accessibility', opts: ['Accessibility ensures everyone can use it (including disabled users), usability measures how easy it is to use', 'They mean the same thing', 'Accessibility is about speed', 'Usability is about visual design only'], c: 0 },
    { q: 'What is heuristic evaluation?', d: 'advanced', cat: 'UX Research', opts: ['An expert review of a UI against established usability principles', 'An automated testing method', 'A machine learning algorithm', 'A statistical analysis technique'], c: 0 },
  ],
  'Database Engineering': [
    { q: 'What is a primary key?', d: 'beginner', cat: 'SQL', opts: ['A unique identifier for each record in a database table', 'The first column in a table', 'A password for the database', 'A type of index'], c: 0 },
    { q: 'What is the difference between SQL and NoSQL databases?', d: 'beginner', cat: 'Databases', opts: ['SQL is relational with fixed schemas, NoSQL is non-relational with flexible schemas', 'SQL is newer than NoSQL', 'NoSQL is always faster', 'They are the same thing'], c: 0 },
    { q: 'What does CRUD stand for?', d: 'beginner', cat: 'Databases', opts: ['Create, Read, Update, Delete', 'Copy, Remove, Update, Deploy', 'Create, Remove, Upload, Download', 'Code, Run, Update, Debug'], c: 0 },
    { q: 'What is a foreign key?', d: 'beginner', cat: 'SQL', opts: ['A field in one table that references the primary key in another table', 'A key from a different country', 'An encrypted key', 'A backup key'], c: 0 },
    { q: 'What is database normalization?', d: 'intermediate', cat: 'Database Design', opts: ['Organizing data to reduce redundancy and improve data integrity', 'Making all data lowercase', 'Compressing database files', 'Encrypting sensitive data'], c: 0 },
    { q: 'What is an index in a database?', d: 'intermediate', cat: 'Performance', opts: ['A data structure that improves the speed of data retrieval operations', 'The first row of a table', 'A table of contents', 'A backup mechanism'], c: 0 },
    { q: 'What is the ACID property in databases?', d: 'intermediate', cat: 'Transactions', opts: ['Atomicity, Consistency, Isolation, Durability — properties ensuring reliable transactions', 'A chemical property', 'A security protocol', 'A data type'], c: 0 },
    { q: 'What is database sharding?', d: 'advanced', cat: 'Scaling', opts: ['Distributing data across multiple databases to handle large-scale workloads', 'Breaking a database into pieces to delete it', 'Encrypting database shards', 'Creating database backups'], c: 0 },
    { q: 'What is the CAP theorem?', d: 'advanced', cat: 'Distributed Systems', opts: ['A theorem stating that a distributed system can only guarantee two of: Consistency, Availability, Partition Tolerance', 'A theorem about data capping', 'A security certification', 'A performance benchmark'], c: 0 },
    { q: 'What is the difference between optimistic and pessimistic locking?', d: 'advanced', cat: 'Concurrency', opts: ['Optimistic assumes conflicts are rare and checks at commit; pessimistic locks resources immediately', 'They are the same approach', 'Optimistic is always better', 'Pessimistic only works with NoSQL'], c: 0 },
  ],
  'Programming Fundamentals': [
    { q: 'What is a variable in programming?', d: 'beginner', cat: 'Basics', opts: ['A named container for storing data values', 'A type of file', 'A programming language', 'A hardware component'], c: 0 },
    { q: 'What is a function in programming?', d: 'beginner', cat: 'Basics', opts: ['A reusable block of code that performs a specific task', 'A mathematical equation', 'A type of variable', 'A debugging tool'], c: 0 },
    { q: 'What is the difference between a "for" loop and a "while" loop?', d: 'beginner', cat: 'Control Flow', opts: ['A for loop runs a set number of times, a while loop runs until a condition is false', 'They are identical', 'While loops are faster', 'For loops only work with arrays'], c: 0 },
    { q: 'What is a boolean data type?', d: 'beginner', cat: 'Data Types', opts: ['A data type that can only be true or false', 'A decimal number', 'A type of string', 'A list of items'], c: 0 },
    { q: 'What is recursion?', d: 'intermediate', cat: 'Concepts', opts: ['A function that calls itself to solve smaller instances of the same problem', 'A type of loop', 'An error in code', 'A sorting algorithm'], c: 0 },
    { q: 'What is the difference between compiled and interpreted languages?', d: 'intermediate', cat: 'Languages', opts: ['Compiled languages are translated to machine code before running; interpreted languages are executed line by line', 'They are the same', 'Interpreted is always faster', 'Compiled languages are newer'], c: 0 },
    { q: 'What are the four pillars of Object-Oriented Programming?', d: 'intermediate', cat: 'OOP', opts: ['Encapsulation, Abstraction, Inheritance, Polymorphism', 'Variables, Functions, Loops, Classes', 'Create, Read, Update, Delete', 'Input, Process, Output, Storage'], c: 0 },
    { q: 'What is Big O notation?', d: 'advanced', cat: 'Complexity', opts: ['A mathematical notation describing the upper bound of an algorithm\'s time/space complexity', 'A file format', 'A programming paradigm', 'A debugging technique'], c: 0 },
    { q: 'What is the difference between concurrency and parallelism?', d: 'advanced', cat: 'Concepts', opts: ['Concurrency deals with multiple tasks in progress; parallelism executes multiple tasks simultaneously', 'They mean the same thing', 'Concurrency is always faster', 'Parallelism only works on one core'], c: 0 },
    { q: 'What is a design pattern in software engineering?', d: 'advanced', cat: 'Design Patterns', opts: ['A reusable solution to a commonly occurring problem in software design', 'A visual design for UIs', 'A database schema', 'A testing methodology'], c: 0 },
  ],
}

// Alias topics that map to the same question pool
const TOPIC_ALIASES = {
  'Science & Nature': 'Programming Fundamentals',
  'General Knowledge': 'Programming Fundamentals',
  'Mathematics': 'Data Science',
  'History': 'Programming Fundamentals',
  'Geography': 'Programming Fundamentals',
  'Gadgets & Technology': 'DevOps & Cloud',
}

/**
 * Generates a quiz from the local question bank.
 * @param {string} topicName — matches a key in QUESTION_BANK or TOPIC_ALIASES
 * @param {string|null} subtopic — optional subtopic for filtering
 * @returns {{ quiz_title: string, quiz_description: string, questions: Array }}
 */
export function generateLocalQuiz(topicName, subtopic = null) {
  const resolvedTopic = TOPIC_ALIASES[topicName] || topicName
  const pool = QUESTION_BANK[resolvedTopic] || QUESTION_BANK['Programming Fundamentals']

  // Separate by difficulty
  const beginner = shuffle(pool.filter((q) => q.d === 'beginner'))
  const intermediate = shuffle(pool.filter((q) => q.d === 'intermediate'))
  const advanced = shuffle(pool.filter((q) => q.d === 'advanced'))

  // Pick: 4 beginner, 3 intermediate, 3 advanced (or whatever is available)
  const selected = [
    ...beginner.slice(0, 4),
    ...intermediate.slice(0, 3),
    ...advanced.slice(0, 3),
  ]

  // If we don't have enough, fill from any difficulty
  if (selected.length < 10) {
    const usedQs = new Set(selected.map((q) => q.q))
    const remaining = shuffle(pool.filter((q) => !usedQs.has(q.q)))
    selected.push(...remaining.slice(0, 10 - selected.length))
  }

  const questions = selected.slice(0, 10).map((q, idx) => {
    // Shuffle options and track correct answer
    const optIndices = shuffle([0, 1, 2, 3])
    const options = optIndices.map((origIdx, newIdx) => ({
      id: String.fromCharCode(97 + newIdx), // a, b, c, d
      text: q.opts[origIdx],
      isCorrect: origIdx === q.c,
    }))

    return {
      id: `q${idx + 1}`,
      question: q.q,
      difficulty: q.d,
      category: q.cat,
      options,
    }
  })

  return {
    quiz_title: `${subtopic || topicName} Assessment`,
    quiz_description: `Test your ${subtopic || topicName} knowledge`,
    questions,
  }
}

/**
 * Generates a chapter quiz from the local question bank using course/chapter info.
 * @param {string} chapterTitle
 * @param {string} courseTitle
 * @param {string} courseCategory
 * @returns {Array} questions
 */
export function generateLocalChapterQuiz(chapterTitle, courseTitle, courseCategory) {
  // Find best matching topic
  const searchText = `${chapterTitle} ${courseTitle} ${courseCategory}`.toLowerCase()
  const topicKeys = Object.keys(QUESTION_BANK)
  
  let bestTopic = 'Programming Fundamentals'
  let bestScore = 0
  
  for (const topic of topicKeys) {
    const words = topic.toLowerCase().split(/[\s&/]+/)
    let score = 0
    for (const word of words) {
      if (word.length >= 3 && searchText.includes(word)) score++
    }
    if (score > bestScore) {
      bestScore = score
      bestTopic = topic
    }
  }

  const pool = QUESTION_BANK[bestTopic]
  const selected = shuffle(pool).slice(0, 5)

  return selected.map((q, idx) => {
    const optIndices = shuffle([0, 1, 2, 3])
    const options = optIndices.map((origIdx, newIdx) => ({
      id: String.fromCharCode(97 + newIdx),
      text: q.opts[origIdx],
      isCorrect: origIdx === q.c,
    }))

    return {
      id: `q${idx + 1}`,
      question: q.q,
      position: idx,
      options,
    }
  })
}
