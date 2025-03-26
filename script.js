document.getElementById('startTest').addEventListener('click', function() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('patientInfo').style.display = 'block';
});

document.getElementById('proceedTest').addEventListener('click', function() {
    const patientId = document.getElementById('patientId').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (patientId && age && gender) {
        localStorage.setItem('patientInfo', JSON.stringify({ patientId, age, gender }));
        document.getElementById('patientInfo').style.display = 'none';
        document.getElementById('testContainer').style.display = 'block';
        startTest();
    } else {
        alert('Please enter all details');
    }
});

const tests = [memoryTest, attentionTest, logicTest, clockTest];
let currentTest = 0;
let testResults = [];
let startTime;

function startTest() {
    startTime = new Date().getTime();
    testResults[currentTest] = { response: null, timeTaken: null };
    tests[currentTest]();
}

document.getElementById('nextTest').addEventListener('click', function() {
    const endTime = new Date().getTime();
    testResults[currentTest].timeTaken = (endTime - startTime) / 1000;

    if (currentTest < tests.length - 1) {
        currentTest++;
        startTime = new Date().getTime();
        testResults[currentTest] = { response: null, timeTaken: null }; // Initialize for next test
        tests[currentTest]();
        document.getElementById('nextTest').style.display = 'none';
    } else {
        generatePDF();
    }
});

// 🧠 1️⃣ MEMORY TEST
function memoryTest() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = "<h3>Memorize these images</h3>";

    let allImages = [
        "https://tse3.mm.bing.net/th?id=OIP.lB3JOWWjOOKnMgNL9aV5QgHaHa&pid=Api&P=0&h=180",
        "https://tse3.mm.bing.net/th?id=OIP.DYs6-8iT1mpNgUolx4BCLgHaHn&pid=Api&P=0&h=180",
        "https://content.etilize.com/2000/1053407425.jpg",
        "https://i.pinimg.com/originals/c8/4c/93/c84c93e2c5fa843aa17506c12d5d9b0b.jpg",
        "https://tse1.mm.bing.net/th?id=OIP.4Ag7SKI1WQ2yIdzNxegPGwHaEW&pid=Api&P=0&h=180",
        "https://www.hdwallpapers.in/download/green_leafed_trees_branches_in_blur_green_leaves_background_4k_hd_nature-HD.jpg",
        "https://i5.walmartimages.com/asr/74e7cc80-d675-45f0-bdff-c0d344b68c20.6c7b70c20b1cfdcda8836823c8c2284d.jpeg",
        "https://i5.walmartimages.com/asr/37213511-ad7a-4552-8a39-79636f9c88cf_1.74442667304ea0aa67b0f8d9e7029aa9.jpeg",
        "https://pngimg.com/uploads/lipstick/lipstick_PNG4.png",
        "https://p1.pxfuel.com/preview/653/702/399/rose-flower-flowers-red-rose.jpg"
    ];

    let selectedImages = allImages.sort(() => Math.random() - 0.5).slice(0, 5);
    testResults[currentTest].response = selectedImages;

    selectedImages.forEach(img => {
        let imgElement = document.createElement('img');
        imgElement.src = img;
        testContent.appendChild(imgElement);
    });

    setTimeout(() => {
        testContent.innerHTML = "<h3>Select the images you saw</h3>";
        let chosenImages = [];

        allImages.forEach(img => {
            let imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.onclick = function() {
                if (chosenImages.includes(img)) {
                    chosenImages = chosenImages.filter(i => i !== img);
                    imgElement.classList.remove("selected");
                } else if (chosenImages.length < 5) {
                    chosenImages.push(img);
                    imgElement.classList.add("selected");
                }
                enableNextButton(chosenImages);
            };
            testContent.appendChild(imgElement);
        });
        document.getElementById('nextTest').style.display = 'none';
    }, 5000);
}

function enableNextButton(selected) {
    document.getElementById('nextTest').style.display = selected.length === 5 ? 'block' : 'none';
}

// 🎯 2️⃣ ATTENTION TEST
function attentionTest() {
    const testContent = document.getElementById('testContent');
    let sequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1);
    
    testResults[currentTest].response = sequence;

    testContent.innerHTML = `<h3>Memorize this sequence: ${sequence.join("-")}</h3>`;
    setTimeout(() => {
        testContent.innerHTML = '<input type="text" id="userInput" placeholder="Enter the sequence">';
        document.getElementById('nextTest').style.display = 'block';
    }, 3000);
}

// 🤔 3️⃣ LOGIC TEST
function logicTest() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `
        <h3>Complete the pattern: 🔺⚫🔺⚫ ?</h3>
        <button onclick="storeLogicAnswer('🔺')">🔺</button>
        <button onclick="storeLogicAnswer('⚫')">⚫</button>
        <button onclick="storeLogicAnswer('◼')">◼</button>
    `;
}

function storeLogicAnswer(answer) {
    testResults[currentTest].response = answer;
    document.getElementById('nextTest').style.display = 'block';
}

// ⏰ 4️⃣ CLOCK TEST
function clockTest() {
    const testContent = document.getElementById('testContent');
    testContent.innerHTML = `<h3>Select the correct clock showing 10:00</h3>`;

    let clocks = [
        "https://as1.ftcdn.net/v2/jpg/01/37/21/94/1000_F_137219446_kjJcsTAARu9Yk2wVAlCNypRiOdw0JxGt.jpg",
        "https://static.vecteezy.com/system/resources/previews/035/271/158/original/wall-analog-clock-design-show-at-10-o-clock-time-and-clock-illustration-free-png.png",
        "https://vt-vtwa-assets.varsitytutors.com/vt-vtwa/uploads/problem_question_image/image/23207/8.png",
        "https://c8.alamy.com/comp/WM77PF/three-oclock-WM77PF.jpg"
        
    ];
    let correctClock = clocks[1];  // Assume second clock is correct
    testResults[currentTest].response = correctClock;

    clocks.forEach((img, index) => {
        let imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.onclick = function () {
            testResults[currentTest].response = img;
            document.getElementById('nextTest').style.display = 'block';
        };
        testContent.appendChild(imgElement);
    });
}
function calculateScore() {
    let score = 0;

    // Memory Test: +1 if at least 3 correct images are recalled
    let correctMemory = testResults[0].response.slice(0, 5); // First 5 are correct
    let userMemory = testResults[0].response || [];
    let correctCount = userMemory.filter(img => correctMemory.includes(img)).length;
    if (correctCount >= 3) score += 1;

    // Attention Test: +1 if sequence matches
    let correctSequence = testResults[1].response;
    let userSequence = document.getElementById('userInput')?.value?.split('-') || [];
    if (JSON.stringify(correctSequence) === JSON.stringify(userSequence)) score += 1;

    // Logic Test: +1 if correct pattern selected (🔺)
    if (testResults[2].response === '🔺') score += 1;

    // Clock Test: +2 if correct clock selected
    let correctClock = "https://static.vecteezy.com/system/resources/previews/035/271/158/original/wall-analog-clock-design-show-at-10-o-clock-time-and-clock-illustration-free-png.png";
    if (testResults[3].response === correctClock) score += 2;

    return score;
}
function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let patientInfo = JSON.parse(localStorage.getItem('patientInfo'));

    let finalScore = calculateScore(); // Total Score
    let completionTime = (new Date().getTime() - startTime) / 1000; // Test Duration

    let testNames = ["Memory Test", "Attention Test", "Logic Test", "Clock Test"];
    let testScores = calculateIndividualScores(); // Get individual test scores

    // 📝 Title & Patient Details
    doc.setFontSize(16);
    doc.text("Alzheimer's Cognitive Test Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Patient ID: ${patientInfo.patientId}`, 10, 20);
    doc.text(`Age: ${patientInfo.age}`, 10, 30);
    doc.text(`Gender: ${patientInfo.gender}`, 10, 40);
    doc.text(`Final Score: ${finalScore}/5`, 10, 50);
    doc.text(`Test Completion Time: ${completionTime.toFixed(2)} sec`, 10, 60);

    let y = 70;
    testResults.forEach((result, index) => {
        let questionTitle = `${testNames[index]}:`;
        let responseText = Array.isArray(result.response) ? result.response.length + " selections" : result.response;
        let timestamp = new Date(startTime + result.timeTaken * 1000).toLocaleTimeString();

        // ✅ Adding Test Details to PDF
        doc.text(`${questionTitle}`, 10, y);
        doc.text(`Score: ${testScores[index]}`, 15, y + 10);
        doc.text(`Time Taken: ${result.timeTaken.toFixed(2)} sec`, 15, y + 20);
        doc.text(`Timestamp: ${timestamp}`, 15, y + 30);
        y += 40;
    });

    let filename = `${patientInfo.patientId}_test-report.pdf`;
    doc.save(filename);

    // 🎯 Show Final Score & Restart Button
    document.getElementById('testContainer').style.display = 'none';
    document.getElementById('scoreBoard').innerHTML = `
        <h2>Final Score: ${finalScore}/5</h2>
        <button onclick="restartTest()">Restart Test</button>
    `;
    document.getElementById('scoreBoard').style.display = 'block';
}

// 📊 Function to Calculate Individual Scores
function calculateIndividualScores() {
    let scores = [0, 0, 0, 0];

    // 🧠 Memory Test: +1 if 3+ correct images recalled
    let correctMemory = testResults[0].response.slice(0, 5);
    let userMemory = testResults[0].response || [];
    let correctCount = userMemory.filter(img => correctMemory.includes(img)).length;
    if (correctCount >= 3) scores[0] = 1;

    // 🎯 Attention Test: +1 if sequence matches
    let correctSequence = testResults[1].response;
    let userSequence = document.getElementById('userInput')?.value?.split('-') || [];
    if (JSON.stringify(correctSequence) === JSON.stringify(userSequence)) scores[1] = 1;

    // 🤔 Logic Test: +1 if correct pattern selected (🔺)
    if (testResults[2].response === '🔺') scores[2] = 1;

    // ⏰ Clock Test: +2 if correct clock selected
    let correctClock = "https://static.vecteezy.com/system/resources/previews/035/271/158/original/wall-analog-clock-design-show-at-10-o-clock-time-and-clock-illustration-free-png.png";
    if (testResults[3].response === correctClock) scores[3] = 2;

    return scores;
}

// Restart Test Function
function restartTest() {
    localStorage.removeItem('patientInfo'); // Clear stored data
    testResults = [];
    currentTest = 0;
    document.getElementById('scoreBoard').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
}