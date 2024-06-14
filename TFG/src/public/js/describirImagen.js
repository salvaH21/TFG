let net;

async function cargarModelo() {
    const response = await fetch('/models/modeloEntrenado.json');
    const modelData = await response.json();
    net = new brain.NeuralNetwork().fromJSON(modelData);
    console.log('Modelo cargado');
}

async function describeImage(processedImage) {
    // Asegúrate de que el modelo esté cargado
    if (!net) {
        await cargarModelo();
    }


    // Verifica que processedImage no esté undefined
    if (!processedImage || processedImage.length === 0) {
        throw new Error('La imagen procesada está vacía o indefinida.');
    }

    // Generar la descripción utilizando el modelo
    const output = net.run(processedImage);

    return output;
}
