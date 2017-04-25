

    $(function(){
        var canvas = document.querySelector('canvas'),
                ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.lineWidth = .3;
        ctx.strokeStyle = (new Color(150)).style;

        var mousePosition = {
            x: 30 * canvas.width / 100,
            y: 30 * canvas.height / 100
        };

        var dots = {
            nb: 250,   //在Canvas中创建250个点
            distance: 100,
            d_radius: 150,
            array: []
        };

        function colorValue(min) {
            return Math.floor(Math.random() * 255 + min);
        }

        /*生成随机的颜色*/
        function createColorStyle(r,g,b) {
            return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
        }
        /*计算连线的RGB值，这个值会小于255*/
        function mixComponents(comp1, weight1, comp2, weight2) {
            return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
        }

        /*计算出生成的两点之间颜色的平均值，这个颜色值是两点连线的颜色rgb值*/
        function averageColorStyles(dot1, dot2) {
            var color1 = dot1.color,
                    color2 = dot2.color;

            var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
                    g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
                    b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
            return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
        }

        /*生成随机的r g b*/
        function Color(min) {
            min = min || 0;
            this.r = colorValue(min);
            this.g = colorValue(min);
            this.b = colorValue(min);
            this.style = createColorStyle(this.r, this.g, this.b);
        }

        /*生成点*/
        function Dot(){
            this.x = Math.random() * canvas.width;//点的X坐标
            this.y = Math.random() * canvas.height;//点的Y坐标

            this.vx = -.5 + Math.random();//点移动的速度 -0.5~0.5 每次移动的距离
            this.vy = -.5 + Math.random();

            this.radius = Math.random() * 2;//得到一个0——2的随机数，作为点的半径

            this.color = new Color(); //给这个点一个随机的颜色
            console.log(this);
        }

        Dot.prototype = {
            draw: function(){
                ctx.beginPath();
                ctx.fillStyle = this.color.style;
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);//，创建一个圆点
                ctx.fill();
            }
        };
        /*在Canvas中创建250个点*/
        function createDots(){
            for(i = 0; i < dots.nb; i++){
                dots.array.push(new Dot());//把这些点加入数组队列中
            }
        }
        /*让点运动*/
        function moveDots() {
            for(i = 0; i < dots.nb; i++){

                var dot = dots.array[i];

                if(dot.y < 0 || dot.y > canvas.height){ //如果点y坐标走出了Canvas的范围，让点的Y坐标往回走
                    dot.vx = dot.vx;
                    dot.vy = - dot.vy;
                }
                else if(dot.x < 0 || dot.x > canvas.width){//如果点X坐标走出了Canvas的范围，让点的坐标往回走
                    dot.vx = - dot.vx;
                    dot.vy = dot.vy;
                }
                dot.x += dot.vx;//每次移动后的位置，超出范围后往回走
                dot.y += dot.vy;
            }
        }
        /*让点之间连线*/
        function connectDots() {
            for(i = 0; i < dots.nb; i++){
                for(j = 0; j < dots.nb; j++){
                    i_dot = dots.array[i];
                    j_dot = dots.array[j];
                    //如果点与点之间x轴，y轴距离小于100&&鼠标与点直X，Y轴间的距离小于150时候进行连线
                    if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
                        if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
                            ctx.beginPath();
                            ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
                            ctx.moveTo(i_dot.x, i_dot.y);
                            ctx.lineTo(j_dot.x, j_dot.y);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            }
        }
        /*画点*/
        function drawDots() {
            for(i = 0; i < dots.nb; i++){
                var dot = dots.array[i];
                dot.draw();
            }
        }
        /*点的动画效果*/
        function animateDots() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            moveDots();
            connectDots();
            drawDots();

            requestAnimationFrame(animateDots);
        }
        /*当鼠标在画布上的时候，位置发生在鼠标光标处*/
        $('canvas').on('mousemove', function(e){
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;
        });
        /*当鼠标不在画布上的时候，位置发生在光标中间*/
        $('canvas').on('mouseleave', function(e){
            mousePosition.x = canvas.width / 2;
            mousePosition.y = canvas.height / 2;
        });

        createDots();
        requestAnimationFrame(animateDots);
    });
