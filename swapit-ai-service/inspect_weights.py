import torch

def inspect():
    checkpoint_path = "weights/multimodal_fusion_model.pth"
    state_dict = torch.load(checkpoint_path, map_location=torch.device('cpu'))
    
    print("--- Model Keys & Shapes ---")
    for key, value in state_dict.items():
        print(f"Key: {key}, Shape: {value.shape}")

if __name__ == "__main__":
    inspect()
