import torch #type: ignore

class CFG:
  device = "cuda"
  seed = 42
  generator = torch.Generator(device).manual_seed(seed)
  image_gen_steps = 35
  image_gen_model_id = "stabilityai/stable-diffusion-2"
  image_gen_size = (300,300)
  image_gen_guidance_scale = 10
  prompt_gen_model_id = "gpt2"
  prompt_dataset_size = 10
  prompt_max_length = 12