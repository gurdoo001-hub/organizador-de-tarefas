// Array para armazenar as tarefas
let tasks = [];
let currentFilter = 'all';

// Carregar tarefas do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateStats();
    renderTasks();
    // Permitir adicionar tarefa com Enter
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Adicionar nova tarefa
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: new Date().toLocaleString('pt-BR')
    };
    
    tasks.unshift(task); // Adiciona no início do array
    input.value = '';
    
    saveTasks();
    updateStats();
    renderTasks();
    
    // Animação de feedback
    input.style.transform = 'scale(0.95)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 100);
}

// Alternar status da tarefa (concluída/pendente)
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        updateStats();
        renderTasks();
    }
}

// Deletar tarefa
function deleteTask(id) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        updateStats();
        renderTasks();
    }
}

// Filtrar tarefas
function filterTasks(filter) {
    currentFilter = filter;
    
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks();
}

// Renderizar tarefas na tela
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    // Filtrar tarefas baseado no filtro atual
    let filteredTasks = tasks;
    
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    // Limpar lista
    taskList.innerHTML = '';
    
    // Verificar se há tarefas
    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    } else {
        emptyState.classList.remove('show');
    }
    
    // Renderizar cada tarefa
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <span class="task-date">${task.date}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                🗑️ Excluir
            </button>
        `;
        
        taskList.appendChild(li);
    });
}

// Atualizar estatísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// Salvar tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Carregar tarefas do localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}