let balloon;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化氣球狀態
  balloon = {
    x: width / 2,
    y: height + 100, // 從畫面下方開始
    r: 45,           // 氣球半徑
    isPopped: false, // 是否被刺破
    speed: 2.5       // 上升速度
  };
}

function draw() {
  background(240); // 淺灰背景以凸顯黑氣球

  if (!balloon.isPopped) {
    // 氣球上升邏輯，碰到頂部邊緣則停止
    if (balloon.y > balloon.r * 1.2) {
      balloon.y -= balloon.speed;
    }

    // 繪製氣球
    push();
    fill(0); // 黑色
    noStroke();
    
    // 氣球主體 (橢圓形)
    ellipse(balloon.x, balloon.y, balloon.r * 2, balloon.r * 2.3);
    
    // 氣球底部的打結處 (小三角形)
    let baseY = balloon.y + balloon.r * 1.1;
    triangle(
      balloon.x, baseY,
      balloon.x - 8, baseY + 12,
      balloon.x + 8, baseY + 12
    );

    // 當按下滑鼠左鍵時，產生左右飄動的線條
    if (mouseIsPressed) {
      stroke(0);
      strokeWeight(2);
      noFill();
      beginShape();
      let startY = baseY + 12;
      let endY = startY + 150; // 線條長度
      
      // 將線條分成多段，利用 sin 函數與 frameCount 達成平滑飄動效果
      for (let i = 0; i <= 20; i++) {
        let t = i / 20;
        let currentY = lerp(startY, endY, t);
        // 越往下擺動幅度越大
        let sway = sin(frameCount * 0.1 + t * 5) * (t * 40); 
        vertex(balloon.x + sway, currentY);
      }
      endShape();
    }
    pop();
    
  } else {
    // 氣球破裂後的粒子特效
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // 模擬重力往下掉
      p.life -= 4; // 逐漸透明消失

      push();
      fill(0, p.life);
      noStroke();
      // 隨機產生圓形或方形碎片
      if (i % 2 === 0) {
        ellipse(p.x, p.y, p.size);
      } else {
        rectMode(CENTER);
        rect(p.x, p.y, p.size, p.size);
      }
      pop();

      // 粒子生命週期結束後移除
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
}

// 點擊事件判斷
function mousePressed() {
  if (!balloon.isPopped) {
    // 計算滑鼠與氣球中心的距離
    let d = dist(mouseX, mouseY, balloon.x, balloon.y);
    
    // 如果點擊範圍在氣球半徑內，則觸發破裂
    if (d < balloon.r * 1.2) {
      balloon.isPopped = true;
      
      // 產生 50 個向外擴散的黑色碎片粒子
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: balloon.x + random(-20, 20),
          y: balloon.y + random(-20, 20),
          vx: random(-12, 12),
          vy: random(-12, 12),
          life: 255,
          size: random(3, 12)
        });
      }
    }
  }
}

// 視窗大小改變時自動調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}