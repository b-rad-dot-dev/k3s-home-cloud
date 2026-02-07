class TodoListModule {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.todos = this.loadTodos();
    this.editModeId = null;
    this.draggedId = null;
    this.longPressTimer = null;
    this.longPressDuration = 500;
    this.touchDragElement = null;
    this.touchDragClone = null;
    this.init();
  }

  async init() {
    // Load HTML template
    const response = await fetch('/modules/todo-list/module.html');
    const html = await response.text();
    this.container.innerHTML = html;

    this.input = this.container.querySelector('.todo-input');
    this.list = this.container.querySelector('.todo-list');

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.input.value.trim()) {
        this.addTodo(this.input.value.trim());
        this.input.value = '';
      }
    });

    // Blur input when clicking outside of it
    this.list.addEventListener('click', () => {
      this.input.blur();
    });

    this.render();
  }

  loadTodos() {
    const stored = localStorage.getItem('todos');
    const todos = stored ? JSON.parse(stored) : [];

    // Ensure all todos have a position property (for backwards compatibility)
    todos.forEach((todo, index) => {
      if (todo.position === undefined) {
        todo.position = index;
      }
    });

    return todos;
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  addTodo(text) {
    const maxPosition = this.todos.reduce((max, todo) =>
        Math.max(max, todo.position || 0), -1);

    this.todos.push({
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      position: maxPosition + 1
    });
    this.saveTodos();
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const wasCompleted = todo.completed;
      todo.completed = !todo.completed;

      if (todo.completed) {
        // Marking as complete - fade and move to bottom
        const element = this.list.querySelector(`[data-id="${id}"]`);
        if (element) {
          element.classList.add('fading');

          // After fade animation, move to bottom
          setTimeout(() => {
            // Don't change position, just save and re-render
            this.saveTodos();
            this.render();
          }, 500);
        }
      } else {
        // Unmarking - restore to original position, no animation
        this.saveTodos();
        this.render();
      }
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.render();
  }

  toggleEditMode(id) {
    if (this.editModeId === id) {
      this.editModeId = null;
    } else {
      this.editModeId = id;
    }
    this.render();
  }

  reorderTodos(draggedId, targetId) {
    const draggedIndex = this.todos.findIndex(t => t.id === draggedId);
    const targetIndex = this.todos.findIndex(t => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedTodo] = this.todos.splice(draggedIndex, 1);
    this.todos.splice(targetIndex, 0, draggedTodo);

    // Update positions based on new order
    this.todos.forEach((todo, index) => {
      todo.position = index;
    });

    this.saveTodos();
    this.render();
  }

  render() {
    // Sort: incomplete items by position, then completed items by position
    const sortedTodos = [...this.todos].sort((a, b) => {
      // If completion status differs, incomplete comes first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Within same completion status, sort by position
      const posA = a.position !== undefined ? a.position : 0;
      const posB = b.position !== undefined ? b.position : 0;
      return posA - posB;
    });

    this.list.innerHTML = sortedTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''} ${this.editModeId === todo.id ? 'edit-mode' : ''}" 
           data-id="${todo.id}">
        <span class="drag-handle" draggable="true" title="Drag to reorder">☰</span>
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-item-text">${this.escapeHtml(todo.text)}</span>
        <button class="delete-btn">Delete</button>
      </div>
    `).join('');

    // Add event listeners
    this.list.querySelectorAll('.todo-item').forEach(item => {
      const id = parseInt(item.dataset.id);
      const checkbox = item.querySelector('input[type="checkbox"]');
      const deleteBtn = item.querySelector('.delete-btn');
      const dragHandle = item.querySelector('.drag-handle');

      // Checkbox toggle
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        this.input.blur(); // Remove focus from input field
        this.toggleTodo(id);
      });

      // Delete button
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.input.blur(); // Remove focus from input field
        this.deleteTodo(id);
      });

      // Right-click to toggle edit mode (mouse only)
      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.toggleEditMode(id);
      });

      // Long press for touch devices - track whether it was a long press
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
            // Haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
            this.toggleEditMode(id);
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

        // Increased threshold to 15px to be more forgiving
        if (deltaX > 15 || deltaY > 15) {
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

        // If it was a quick tap (not a long press) and we're in edit mode, exit edit mode
        if (!wasLongPress && !hasMoved && touchDuration < this.longPressDuration && this.editModeId === id) {
          e.preventDefault(); // Prevent the contextmenu event from firing
          this.toggleEditMode(id);
        }
        wasLongPress = false;
        hasMoved = false;
      };

      // Touch events on the item (not on checkbox, delete button, or drag handle)
      item.addEventListener('touchstart', (e) => {
        if (e.target === checkbox || e.target === deleteBtn || e.target === dragHandle) return;
        this.input.blur(); // Remove focus from input field
        startLongPress(e);
      });

      item.addEventListener('touchmove', (e) => {
        if (e.target === checkbox || e.target === deleteBtn || e.target === dragHandle) return;
        handleTouchMove(e);
      });

      item.addEventListener('touchend', (e) => {
        if (e.target === checkbox || e.target === deleteBtn || e.target === dragHandle) return;
        handleTouchEnd(e);
      });

      item.addEventListener('touchcancel', () => {
        cancelLongPress();
        wasLongPress = false;
        hasMoved = false;
      });

      // Mouse events (for desktop)
      item.addEventListener('mousedown', (e) => {
        if (e.target === checkbox || e.target === deleteBtn || e.target === dragHandle) return;
        // For mouse, we just track for potential long press but don't use it
      });

      // Click to exit edit mode (mouse only)
      item.addEventListener('click', (e) => {
        if (e.target === checkbox || e.target === deleteBtn || e.target === dragHandle) return;
        if (this.editModeId === id) {
          this.toggleEditMode(id);
        }
      });

      // Drag and drop - ONLY from the drag handle
      dragHandle.addEventListener('dragstart', (e) => {
        if (this.editModeId !== id) {
          e.preventDefault();
          return;
        }
        this.draggedId = id;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
      });

      // Touch drag implementation for drag handle
      touchStartY = 0;
      let touchCurrentY = 0;
      let isDragging = false;

      dragHandle.addEventListener('touchstart', (e) => {
        if (this.editModeId !== id) return;
        e.stopPropagation();

        const touch = e.touches[0];
        touchStartY = touch.clientY;
        touchCurrentY = touch.clientY;
        isDragging = true;
        this.draggedId = id;
        this.touchDragElement = item;

        item.classList.add('dragging');
        item.style.opacity = '0.5';
      });

      dragHandle.addEventListener('touchmove', (e) => {
        if (!isDragging || this.draggedId !== id) return;
        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];
        touchCurrentY = touch.clientY;

        // Find the element under the touch point
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const todoItemBelow = elementBelow?.closest('.todo-item');

        // Remove all drag-over classes
        this.list.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over');
        });

        // Add drag-over to the target
        if (todoItemBelow && todoItemBelow !== item) {
          todoItemBelow.classList.add('drag-over');
        }
      });

      dragHandle.addEventListener('touchend', (e) => {
        if (!isDragging || this.draggedId !== id) return;
        e.stopPropagation();

        isDragging = false;
        item.classList.remove('dragging');
        item.style.opacity = '';

        // Find what we dropped on
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const todoItemBelow = elementBelow?.closest('.todo-item');

        // Remove all drag-over classes
        this.list.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over');
        });

        if (todoItemBelow && todoItemBelow !== item) {
          const targetId = parseInt(todoItemBelow.dataset.id);
          this.reorderTodos(this.draggedId, targetId);
        }

        this.draggedId = null;
        this.touchDragElement = null;
      });

      dragHandle.addEventListener('touchcancel', () => {
        if (this.draggedId === id) {
          isDragging = false;
          item.classList.remove('dragging');
          item.style.opacity = '';
          this.draggedId = null;
          this.touchDragElement = null;

          this.list.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
          });
        }
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        this.draggedId = null;
        // Remove all drag-over classes
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
          this.reorderTodos(this.draggedId, id);
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
    // Cleanup if needed
  }
}

window.TodoListModule = TodoListModule;