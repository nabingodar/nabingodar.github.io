Nabin Godar

I am a
> Business Economics Student|
> AI Enthusiast|
> Critical Thinker|
> Technology Explorer|
> Lifelong Learner|
> <h1>Hi, I'm <span class="name">Nabin Godar</span></h1>

<h2>
    I am a <span id="typing"></span>
</h2>
#typing {
    color: #00d4ff;
    font-weight: bold;
    border-right: 3px solid #00d4ff;
    padding-right: 4px;
    animation: blink 0.7s infinite;
}

@keyframes blink {
    50% {
        border-color: transparent;
    }
}
const words = [
    "Business Economics Student",
    "AI Enthusiast",
    "Critical Thinker",
    "Technology Explorer",
    "Lifelong Learner"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typing = document.getElementById("typing");

function type() {

    const currentWord = words[wordIndex];

    if (!deleting) {
        typing.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            deleting = true;
            setTimeout(type, 1800);
            return;
        }

    } else {

        typing.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            wordIndex++;

            if (wordIndex >= words.length)
                wordIndex = 0;
        }
    }

    setTimeout(type, deleting ? 60 : 110);
}

type();
