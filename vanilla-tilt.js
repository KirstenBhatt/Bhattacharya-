// vanilla-tilt.js
(function () {
    "use strict";

    class VanillaTilt {
        constructor(element, settings = {}) {
            if (!(element instanceof Node)) {
                throw "Can't initialize VanillaTilt because " + element + " is not a Node.";
            }

            this.element = element;
            this.settings = this.extendSettings(settings);

            this.reverse = this.settings.reverse ? -1 : 1;
            this.reset = this.reset.bind(this);

            this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;

            if (this.settings.glare) {
                this.prepareGlare();
            }

            this.setEventListeners();
        }

        extendSettings(settings) {
            let defaultSettings = {
                reverse: false,
                max: 15,
                startX: 0,
                startY: 0,
                perspective: 1000,
                easing: "cubic-bezier(.03,.98,.52,.99)",
                speed: 300,
                transition: true,
                glare: false,
                "max-glare": 1,
            };

            let finalSettings = {...defaultSettings, ...settings};

            return finalSettings;
        }

        setEventListeners() {
            this.onMouseEnter = this.onMouseEnter.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseLeave = this.onMouseLeave.bind(this);

            this.element.addEventListener("mouseenter", this.onMouseEnter);
            this.element.addEventListener("mousemove", this.onMouseMove);
            this.element.addEventListener("mouseleave", this.onMouseLeave);

            if (this.settings.glare) {
                window.addEventListener("resize", this.updateGlareSize.bind(this));
            }
        }

        prepareGlare() {
            const glareElement = document.createElement("div");
            glareElement.classList.add("vanilla-tilt-glare");

            const glareInnerElement = document.createElement("div");
            glareInnerElement.classList.add("vanilla-tilt-glare-inner");

            glareElement.appendChild(glareInnerElement);
            this.element.appendChild(glareElement);

            this.glareElementWrapper = glareElement;
            this.glareElement = glareInnerElement;
        }

        updateGlareSize() {
            if (this.glareElement) {
                const rect = this.element.getBoundingClientRect();

                this.glareElementWrapper.style.width = rect.width + "px";
                this.glareElementWrapper.style.height = rect.height + "px";
            }
        }

        onMouseEnter(event) {
            this.updateGlareSize();
            this.reset();
        }

        onMouseMove(event) {
            if (this.element.offsetWidth === 0 || this.element.offsetHeight === 0) {
                return;
            }

            const rect = this.element.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (this.settings.max * (y - centerY) / centerY) * this.reverse;
            const tiltY = (this.settings.max * (centerX - x) / centerX) * this.reverse;

            this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            if (this.settings.glare) {
                const glareX = (x / rect.width) * 2 - 1;
                const glareY = (y / rect.height) * 2 - 1;

                this.glareElement.style.transform = `rotate(${glareX * 180}deg) translate(-${glareX * this.settings["max-glare"] * 100}%, -${glareY * this.settings["max-glare"] * 100}%)`;
                this.glareElement.style.opacity = this.settings["max-glare"];
            }
        }

        onMouseLeave(event) {
            this.reset();
        }

        reset() {
            this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg)`;

            if (this.settings.glare) {
                this.glareElement.style.transform = `rotate(180deg) translate(-50%, -50%)`;
                this.glareElement.style.opacity = 0;
            }
        }
    }

    VanillaTilt.init = function (elements, settings) {
        if (elements instanceof Node) {
            elements = [elements];
        }

        if (elements instanceof NodeList) {
            elements = [].slice.call(elements);
        }

        if (!(elements instanceof Array)) {
            return;
        }

        elements.forEach(element => {
            new VanillaTilt(element, settings);
        });
    };

    if (typeof define === 'function' && define.amd) {
        define(() => VanillaTilt);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = VanillaTilt;
    } else {
        window.VanillaTilt = VanillaTilt;
    }
})();