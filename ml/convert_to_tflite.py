import os
import tensorflow as tf

def convert_keras_to_tflite(
    keras_model_path: str = "ml/artifacts/brain-tumor-detection-model.keras",
    tflite_output_path: str = "ml/artifacts/brain-tumor-model.tflite",
    quantize: bool = True,
):
    """
    Converts a Keras .keras model to TensorFlow Lite (.tflite) format.
    
    Args:
        keras_model_path: Path to the input .keras file.
        tflite_output_path: Destination path for the .tflite model.
        quantize: If True, applies post-training dynamic range quantization,
                  reducing model size by ~75% and minimizing runtime RAM usage.
    """
    print(f"Loading Keras model from {keras_model_path}...")
    # compile=False avoids allocating optimizer states (saves memory during conversion)
    model = tf.keras.models.load_model(keras_model_path, compile=False)

    print("Initializing TFLite Converter...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    if quantize:
        print("Applying dynamic range quantization (DEFAULT)...")
        converter.optimizations = [tf.lite.Optimize.DEFAULT]

    print("Converting model to TFLite FlatBuffer format...")
    tflite_model = converter.convert()

    os.makedirs(os.path.dirname(tflite_output_path), exist_ok=True)
    with open(tflite_output_path, "wb") as f:
        f.write(tflite_model)

    original_size_mb = os.path.getsize(keras_model_path) / (1024 * 1024)
    tflite_size_mb = os.path.getsize(tflite_output_path) / (1024 * 1024)

    print(f"Conversion complete!")
    print(f"  Original (.keras):  {original_size_mb:.2f} MB")
    print(f"  Converted (.tflite): {tflite_size_mb:.2f} MB")
    print(f"Saved to: {tflite_output_path}")

if __name__ == "__main__":
    convert_keras_to_tflite()
