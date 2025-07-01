document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    // const slideWidth = slides[0].offsetWidth; // Não é mais necessário diretamente aqui se usar offsetLeft

    // Função para mover o carrossel para um slide específico
    const moveToSlide = (track, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.offsetLeft + 'px)';
    };

    // Função para atualizar os pontos de navegação
    const updateDots = (dotsContainer, targetIndex) => {
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            if (index === targetIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
        // Atualiza aria-hidden para os slides para acessibilidade
        slides.forEach((slide, index) => {
            if (index === targetIndex) {
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
    };

    // Função para gerar os pontos de navegação dinamicamente
    const generateDots = () => {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-controls', `slide${index + 1}`);
            dot.setAttribute('aria-label', `Ir para o slide ${index + 1}`);
            dot.setAttribute('tabindex', '0'); // Torna o dot focável

            dot.addEventListener('click', () => {
                currentIndex = index;
                moveToSlide(carouselTrack, slides[currentIndex]);
                updateDots(carouselDotsContainer, currentIndex);
            });
            carouselDotsContainer.appendChild(dot);
        });
        updateDots(carouselDotsContainer, currentIndex); // Ativa o primeiro ponto
    };

    // Lógica para mostrar spinner e carregar imagem
    const handleImageLoad = () => {
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            const spinner = slide.querySelector('.spinner');

            if (img && spinner) {
                spinner.style.display = 'block'; // Mostra o spinner
                img.style.display = 'none'; // Esconde a imagem inicialmente

                // Usa um novo objeto Image para garantir que o evento 'load' dispare corretamente
                const tempImg = new Image();
                tempImg.src = img.src;

                tempImg.onload = () => {
                    spinner.style.display = 'none'; // Esconde o spinner
                    img.style.display = 'block'; // Mostra a imagem
                };

                tempImg.onerror = () => {
                    spinner.style.display = 'none'; // Esconde o spinner mesmo com erro
                    console.error('Erro ao carregar imagem:', img.src);
                    // Opcional: exiba uma imagem de placeholder ou uma mensagem de erro no slide
                };
            }
        });
    };


    // Event Listeners para os botões de navegação
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = slides.length - 1; // Volta para o último slide
        }
        moveToSlide(carouselTrack, slides[currentIndex]);
        updateDots(carouselDotsContainer, currentIndex);
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Volta para o primeiro slide
        }
        moveToSlide(carouselTrack, slides[currentIndex]);
        updateDots(carouselDotsContainer, currentIndex);
    });

    // Ajusta a posição do carrossel ao redimensionar a janela
    window.addEventListener('resize', () => {
        // Recalcula a largura de cada slide em caso de redimensionamento
        // e garante que o carrossel se ajuste
        moveToSlide(carouselTrack, slides[currentIndex]);
    });

    // Inicializa os pontos ao carregar a página
    generateDots();
    // Inicia o carregamento das imagens e controle do spinner
    handleImageLoad();

    // Opcional: Adiciona auto-play (descomentado)
    setInterval(() => {
        nextButton.click();
    }, 5000); // Muda a cada 5 segundos
});
