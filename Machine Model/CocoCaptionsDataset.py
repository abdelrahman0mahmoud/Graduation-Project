import torch # type: ignore
from torch.utils.data import DataLoader, Dataset # type: ignore
from pycocotools.coco import COCO # type: ignore
from PIL import Image # type: ignore
import os


class CocoCaptionsDataset(Dataset):
    def __init__(self, root, annFile, transform=None):
        self.root = root
        self.coco = COCO(annFile)
        self.ids = list(self.coco.imgs.keys())
        self.transform = transform
    def __getitem__(self, index):
        coco = self.coco
        img_id = self.ids[index]
        ann_ids = coco.getAnnIds(imgIds=img_id)
        caption = coco.loadAnns(ann_ids)[0]['caption']
        path = coco.loadImgs(img_id)[0]['file_name']
        image = Image.open(os.path.join(self.root, path)).convert('RGB')
        if self.transform is not None:
            image = self.transform(image)
        return image, caption
    def __len__(self):
        return len(self.ids)