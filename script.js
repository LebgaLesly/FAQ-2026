window.onload = async function loadFAQ() {
    try {
      const response = await fetch('faq_data.json');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const faqData = await response.json();
  
      let faqList = faqData.faq;
      let faqContainer = document.getElementById("faq-container");
      let paginationContainer = document.getElementById("pagination");
  
      let currentPage = 1;
      const itemsPerPage = 7;
  
      function renderFAQPage(page) {
        faqContainer.innerHTML = "";
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        faqList.slice(start, end).forEach((faq, index) => {
          const faqItem = document.createElement("div");
          faqItem.classList.add("faq-item");
  
          const question = document.createElement("div");
          question.classList.add("question");
  
          const questionText = document.createElement("span");
          questionText.textContent = faq.question;
  
          const arrow = document.createElement("span");
          arrow.classList.add("arrow");
          arrow.textContent = "▶";
  
          question.appendChild(questionText);
          question.appendChild(arrow);
  
          const answer = document.createElement("div");
          answer.classList.add("answer");
          answer.id = `faq-${index}`;
          answer.style.display = "none";
          answer.innerHTML = formatTextWithLinks(faq.answer);
  
          question.onclick = () => {
            const isVisible = answer.style.display === "block";
            document.querySelectorAll(".answer").forEach(a => (a.style.display = "none"));
            document.querySelectorAll(".arrow").forEach(ar => (ar.textContent = "▶"));
  
            if (!isVisible) {
              answer.style.display = "block";
              arrow.textContent = "▼";
            }
          };
  
          faqItem.appendChild(question);
          faqItem.appendChild(answer);
          faqContainer.appendChild(faqItem);
        });
      }
  
      function renderPagination(page) {
        const totalPages = Math.ceil(faqList.length / itemsPerPage);
        paginationContainer.innerHTML = "";
  
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.disabled = page === 1;
        prevBtn.className = `pagination-btn ${page === 1 ? 'disabled' : ''}`;
        prevBtn.onclick = () => {
          if (page > 1) {
            currentPage--;
            renderFAQPage(currentPage);
            renderPagination(currentPage);
          }
        };
        paginationContainer.appendChild(prevBtn);
  
        // Sliding Window for Page Numbers (max 4 buttons)
        let start = Math.max(1, page - 2);
        let end = Math.min(start + 3, totalPages);
  
        // Adjust start if at the end
        if (end - start < 3) {
          start = Math.max(1, end - 3);
        }
  
        for (let i = start; i <= end; i++) {
          const pageBtn = document.createElement("button");
          pageBtn.textContent = i;
          pageBtn.className = `pagination-btn ${i === page ? 'active' : ''}`;
          pageBtn.onclick = () => {
            currentPage = i;
            renderFAQPage(currentPage);
            renderPagination(currentPage);
          };
          paginationContainer.appendChild(pageBtn);
        }
  
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.disabled = page === totalPages;
        nextBtn.className = `pagination-btn ${page === totalPages ? 'disabled' : ''}`;
        nextBtn.onclick = () => {
          if (page < totalPages) {
            currentPage++;
            renderFAQPage(currentPage);
            renderPagination(currentPage);
          }
        };
        paginationContainer.appendChild(nextBtn);
      }
  
      renderFAQPage(currentPage);
      renderPagination(currentPage);
    } catch (error) {
      console.error("Error loading FAQ data:", error);
    }
  };
  
  function formatTextWithLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,})/g;
  
    if (Array.isArray(text)) {
      return text
        .map(item => `<div><a href="${item}" target="_blank" class="faq-link">${item}</a></div>`)
        .join('');
    }
  
    text = text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="faq-link">${url}</a>`);
    text = text.replace(emailRegex, email => `<a href="mailto:${email}" class="faq-link">${email}</a>`);
    return text;
  }
  