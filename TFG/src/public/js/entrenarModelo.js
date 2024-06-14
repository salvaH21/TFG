async function entrenarModelo() {
    const response = await fetch('/datos.json');
    const data = await response.json();

    // Preparar los datos para el entrenamiento
    const trainingData = data.map(item => ({
        input: item.features,
        output: { [item.label]: 1 }
    }));

    // Configurar el modelo
    const net = new brain.NeuralNetwork({
        hiddenLayers: [64, 64], // Ajustar esto según sea necesario
        activation: 'tanh' // Otras opciones: 'relu', 'sigmoid', 'tanh'
    });

    // Entrenar el modelo
    const stats = net.train(trainingData, {
        iterations: 20000, // Número de iteraciones
        log: true, // Para ver el progreso en la consola
        logPeriod: 500, // Muestra el progreso cada 500 iteraciones
        learningRate: 0.0001 // Tasa de aprendizaje
    });

    // Mostrar los resultados del entrenamiento
    document.getElementById('output').textContent = JSON.stringify(stats, null, 2);

    // Guardar el modelo entrenado en el servidor
    const modelJSON = net.toJSON();
    await fetch('/modeloEntrenado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: modelJSON })
    });

    alert('Modelo entrenado guardado');
}

