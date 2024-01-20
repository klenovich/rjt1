document.addEventListener('DOMContentLoaded', function () {
    const circle = document.getElementById('circle');
    const audio = document.getElementById('audio');
    let dragging = false;
    let lastAngle = 0;
    const vinylRadius = circle.offsetWidth / 2;
    let rotation = 0;
    let spinInterval;
   
    function
    
   polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    }
   
    function
    
   angle(center, p1) {
      const p0 = {
        x: center.x,
        y: center.y - Math.sqrt(Math.pow(p1.x - center.x, 2) + Math.pow(p1.y - center.y, 2))
      };
      return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI + 360) % 360;
    }
   
    function getPositionFromCenter(elem, event) {
      const rect = elem.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return angle({ x: centerX, y: centerY }, { x: event.clientX, y: event.clientY });
    }
   
    function updateRotation() {
      if (!dragging && audio.paused === false) {
        const rotationSpeed = audio.playbackRate * 10; // Adjust base rotation speed here
        rotation = (rotation + rotationSpeed) % 360;
        circle.style.transform = `rotate(${rotation}deg)`;
      }
    }
   
    circle.addEventListener('mousedown', function (event) {
      event.preventDefault();
      audio.pause(); // Pause audio on hard press
      clearInterval(spinInterval); // Stop spinning while dragging
      dragging = true;
      lastAngle = getPositionFromCenter(this, event);
    });
   
    document.addEventListener('mousemove', function (event) {
      if (dragging) {
        const newAngle = getPositionFromCenter(circle, event);
        let angleDifference = newAngle - lastAngle;
   
        if (angleDifference < -180) {
          angleDifference += 360;
        } else if (angleDifference > 180) {
          angleDifference -= 360;
        }
   
        const rateChange = angleDifference / 360;
        audio.playbackRate = Math.max(0.5, Math.min(4, audio.playbackRate + rateChange));
        audio.currentTime += rateChange * (audio.duration / vinylRadius);
        lastAngle = newAngle;
      }
    });
   
    document.addEventListener('mouseup', function (event) {
      dragging = false;
      if (audio.paused === false) { // Restart spinning after dragging if audio is playing
        spinInterval = setInterval(updateRotation, 50);
      }
    });
   
    circle.addEventListener('click', function () {
      if (!audio.paused) {
        audio.pause(); // Pause on click
        clearInterval(spinInterval); // Stop spinning
      } else {
        audio.play();
        spinInterval = setInterval(updateRotation, 50); // Start spinning if not already
      }
    });
   
    audio.addEventListener('ended', function () {
      clearInterval(spinInterval);
    });
   
    if (audio.paused === false) { // Start spinning initially if audio is playing
      spinInterval = setInterval(updateRotation, 50);
    }
   });