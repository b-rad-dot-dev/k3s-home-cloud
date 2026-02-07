class NotesModule {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.notes = this.loadNotes();
    this.actionModeId = null;
    this.draggedId = null;
    this.longPressTimer = null;
    this.longPressDuration = 500;
    this.init();
  }

  async init() {
    const response = await fetch('/modules/notes/module.html');
    const html = await response.text();
    this.container.innerHTML = html;

    this.input = this.container.querySelector('.notes-input');
    this.list = this.container.querySelector('.notes-list');

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (this.input.value.trim()) {
          this.addNote(this.input.value.trim());
          this.input.value = '';
        }
      }
    });

    // Expand to 2 rows when focused, collapse to 1 when blurred
    this.input.addEventListener('focus', () => {
      this.input.rows = 2;
    });

    this.input.addEventListener('blur', () => {
      this.input.rows = 1;
    });

    this.render();
  }

  loadNotes() {
    const stored = localStorage.getItem('notes');
    return stored ? JSON.parse(stored) : [];
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  addNote(text) {
    this.notes.push({
      id: Date.now(),
      text,
      createdAt: new Date().toISOString()
    });
    this.saveNotes();
    this.render();
  }

  updateNote(id, newText) {
    const note = this.notes.find(n => n.id === id);
    if (note && newText.trim()) {
      note.text = newText.trim();
      this.saveNotes();
      this.render();
    }
  }

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveNotes();
    this.render();
  }

  toggleActionMode(id) {
    if (this.actionModeId === id) {
      this.actionModeId = null;
    } else {
      this.actionModeId = id;
    }
    this.render();
  }

  reorderNotes(draggedId, targetId) {
    const draggedIndex = this.notes.findIndex(n => n.id === draggedId);
    const targetIndex = this.notes.findIndex(n => n.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedNote] = this.notes.splice(draggedIndex, 1);
    this.notes.splice(targetIndex, 0, draggedNote);

    this.saveNotes();
    this.render();
  }

  startEdit(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;

    const listItem = this.list.querySelector(`[data-id="${id}"]`);
    if (!listItem) return;

    listItem.classList.remove('action-mode');
    listItem.classList.add('editing');

    // Count lines to set initial rows
    const lineCount = (note.text.match(/\n/g) || []).length + 1;
    const rows = Math.min(Math.max(lineCount, 1), 3);

    listItem.innerHTML = `<textarea class="note-edit-input" rows="${rows}">${this.escapeHtml(note.text)}</textarea>`;

    const textarea = listItem.querySelector('.note-edit-input');
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    const finishEdit = () => {
      const newText = textarea.value;
      if (newText.trim()) {
        this.updateNote(id, newText);
      } else {
        this.render();
      }
    };

    textarea.addEventListener('blur', finishEdit);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textarea.blur();
      }
      if (e.key === 'Escape') {
        this.render();
      }
    });
  }

  render() {
    this.list.innerHTML = this.notes.map(note => {
      const isActionMode = this.actionModeId === note.id;
      return `
        <li data-id="${note.id}" class="${isActionMode ? 'action-mode' : ''}">
          <span class="note-drag-handle" draggable="true">☰</span>
          <span class="note-text">${this.escapeHtml(note.text)}</span>
          <button class="note-edit-btn">Edit</button>
          <button class="note-delete-btn">Delete</button>
        </li>
      `;
    }).join('');

    // Add event listeners for editing
    this.list.querySelectorAll('li').forEach(item => {
      const id = parseInt(item.dataset.id);
      const dragHandle = item.querySelector('.note-drag-handle');
      const editBtn = item.querySelector('.note-edit-btn');
      const deleteBtn = item.querySelector('.note-delete-btn');
      const noteText = item.querySelector('.note-text');

      // Edit button
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startEdit(id);
      });

      // Delete button
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteNote(id);
      });

      // Long press for action mode
      let longPressTimer = null;
      let wasLongPress = false;
      let touchStartTime = 0;
      let touchStartX = 0;
      let touchStartY = 0;
      let hasMoved = false;

      const startLongPress = (e) => {
        wasLongPress = false;
        hasMoved = false;
        touchStartTime = Date.now();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        longPressTimer = setTimeout(() => {
          if (!hasMoved) {
            wasLongPress = true;
            this.toggleActionMode(id);
          }
        }, this.longPressDuration);
      };

      const cancelLongPress = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      };

      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        // If finger moved more than 10px, it's a scroll gesture, cancel long press
        if (deltaX > 10 || deltaY > 10) {
          hasMoved = true;
          cancelLongPress();
        }
      };

      const handleTouchEnd = (e) => {
        if (e.cancelable) {
          e.preventDefault();
        }

        const touchDuration = Date.now() - touchStartTime;
        cancelLongPress();

        // Quick tap exits action mode (only if we didn't move)
        if (!wasLongPress && !hasMoved && touchDuration < this.longPressDuration && this.actionModeId === id) {
          this.toggleActionMode(id);
        }
        wasLongPress = false;
        hasMoved = false;
      };

      // Touch events on note text only - DON'T prevent default to allow scrolling
      noteText.addEventListener('touchstart', (e) => {
        startLongPress(e);
      });

      noteText.addEventListener('touchmove', handleTouchMove);

      noteText.addEventListener('touchend', handleTouchEnd);

      noteText.addEventListener('touchcancel', () => {
        cancelLongPress();
        wasLongPress = false;
        hasMoved = false;
      });

      // Mouse right-click for action mode
      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.toggleActionMode(id);
      });

      // Click to exit action mode (mouse)
      noteText.addEventListener('click', (e) => {
        if (this.actionModeId === id) {
          this.toggleActionMode(id);
        }
      });

      // Drag and drop for mouse
      dragHandle.addEventListener('dragstart', (e) => {
        if (this.actionModeId !== id) {
          e.preventDefault();
          return;
        }
        this.draggedId = id;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
      });

      // Touch drag for drag handle
      touchStartY = 0;
      let isDragging = false;

      dragHandle.addEventListener('touchstart', (e) => {
        if (this.actionModeId !== id) return;
        e.stopPropagation();
        e.preventDefault();

        const touch = e.touches[0];
        touchStartY = touch.clientY;
        isDragging = true;
        this.draggedId = id;

        item.style.opacity = '0.5';
      }, { passive: false });

      dragHandle.addEventListener('touchmove', (e) => {
        if (!isDragging || this.draggedId !== id) return;
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const noteBelow = elementBelow?.closest('li');

        this.list.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over');
        });

        if (noteBelow && noteBelow !== item) {
          noteBelow.classList.add('drag-over');
        }
      }, { passive: false });

      dragHandle.addEventListener('touchend', (e) => {
        if (!isDragging || this.draggedId !== id) return;
        e.stopPropagation();

        isDragging = false;
        item.style.opacity = '';

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const noteBelow = elementBelow?.closest('li');

        this.list.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over');
        });

        if (noteBelow && noteBelow !== item) {
          const targetId = parseInt(noteBelow.dataset.id);
          this.reorderNotes(this.draggedId, targetId);
        }

        this.draggedId = null;
      });

      dragHandle.addEventListener('touchcancel', () => {
        if (this.draggedId === id) {
          isDragging = false;
          item.style.opacity = '';
          this.draggedId = null;

          this.list.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
          });
        }
      });

      // Mouse drag events
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        this.draggedId = null;
        this.list.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over');
        });
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (this.draggedId === null || this.draggedId === id) return;

        e.dataTransfer.dropEffect = 'move';
        item.classList.add('drag-over');
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');

        if (this.draggedId !== null && this.draggedId !== id) {
          this.reorderNotes(this.draggedId, id);
        }
      });
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }
}

window.NotesModule = NotesModule;