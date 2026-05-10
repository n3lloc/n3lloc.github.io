window.startTypewriter = function () {
    const h1 = document.getElementById('typewriter-text');
    const cursor = document.querySelector('.cursor');
    if (!h1 || !cursor) return;

    // ─── 1. PRÉ-CONSTRÓI a estrutura DOM completa ANTES de digitar ───
    // Isso garante que o layout não pule quando textos grandes aparecem
    const smallSpan = document.createElement('span');
    smallSpan.className = 'line-small';

    // Linha "de Alécio,"
    const row1 = document.createElement('div');
    row1.className = 'names-row';
    const conn1 = document.createElement('span');
    conn1.className = 'line-connector';
    const name1 = document.createElement('span');
    name1.className = 'line-name';
    row1.appendChild(conn1);
    row1.appendChild(name1);

    // Linha "para Isabella"
    const row2 = document.createElement('div');
    row2.className = 'names-row';
    const conn2 = document.createElement('span');
    conn2.className = 'line-connector';
    const name2 = document.createElement('span');
    name2.className = 'line-name';
    row2.appendChild(conn2);
    row2.appendChild(name2);

    h1.appendChild(smallSpan);
    h1.appendChild(row1);
    h1.appendChild(row2);

    // ─── 2. Sequência de digitação ───
    const sequence = [
        { el: smallSpan, text: 'uma carta de amor', cursorCls: 'line-small', pauseAfter: 800 },
        { el: conn1, text: 'de  ', cursorCls: 'line-connector', pauseAfter: 0 },
        { el: name1, text: '  Alécio', cursorCls: 'line-name', pauseAfter: 700 },
        { el: conn2, text: 'para  ', cursorCls: 'line-connector', pauseAfter: 0 },
        { el: name2, text: '  Isabella', cursorCls: 'line-name', pauseAfter: 0 },
    ];

    const cursorStyles = {
        'line-small': { fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)' },
        'line-connector': { fontSize: '1.4rem', color: 'rgba(255,255,255,0.6)' },
        'line-name': { fontSize: '3rem', color: 'var(--glow-primary)' },
    };

    function setCursorStyle(cls) {
        const s = cursorStyles[cls] || cursorStyles['line-small'];
        cursor.style.fontSize = s.fontSize;
        cursor.style.color = s.color;
    }

    // ─── 3. Motor de digitação ───
    let segIdx = 0;
    let charIdx = 0;
    const SPEED = 85;

    function typeNext() {
        if (segIdx >= sequence.length) {
            // Terminou — cursor fica após último nome
            name2.appendChild(cursor);
            return;
        }

        const seg = sequence[segIdx];

        if (charIdx === 0) {
            // Move cursor PARA DENTRO do elemento atual
            seg.el.appendChild(cursor);
            setCursorStyle(seg.cursorCls);
        }

        if (charIdx < seg.text.length) {
            // Insere o caractere como texto ANTES do cursor
            const prev = cursor.previousSibling;
            if (prev && prev.nodeType === Node.TEXT_NODE) {
                prev.textContent += seg.text[charIdx];
            } else {
                seg.el.insertBefore(document.createTextNode(seg.text[charIdx]), cursor);
            }
            charIdx++;
            setTimeout(typeNext, SPEED);
        } else {
            segIdx++;
            charIdx = 0;
            setTimeout(typeNext, seg.pauseAfter || 0);
        }
    }

    // Inicializa cursor dentro do smallSpan e começa
    setCursorStyle('line-small');
    smallSpan.appendChild(cursor);
    setTimeout(typeNext, 1000);
};
