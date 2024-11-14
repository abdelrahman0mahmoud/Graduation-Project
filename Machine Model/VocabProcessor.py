from collections import Counter
from torchtext.vocab import build_vocab_from_iterator #type: ignore
from torchtext.data.utils import get_tokenizer #type: ignore
import torch #type: ignore
from torch.nn.utils.rnn import pad_sequence #type: ignore


class VocabProcessor:
    def __init__(self, dataset):
        self.tokenizer = get_tokenizer('basic_english')
        self.vocab = self.build_vocab(dataset)
    def build_vocab(self, dataset):
        counter = Counter()
        for _, caption in dataset:
            tokens = self.tokenizer(caption)
            counter.update(tokens)
        specials = ['<unk>', '<pad>', '<sos>', '<eos>']
        vocab = build_vocab_from_iterator([counter], specials=specials)
        vocab.set_default_index(vocab['<unk>'])
        return vocab
    def process_caption(self, caption):
        tokens = ['<sos>'] + self.tokenizer(caption) + ['<eos>']
        token_ids = [self.vocab[token] for token in tokens]
        return torch.tensor(token_ids, dtype=torch.long)
    def collate_fn(self, batch):
        images, captions = zip(*batch)
        images = torch.stack(images, 0)
        caption_tensors = [self.process_caption(caption) for caption in captions]
        caption_tensors = pad_sequence(caption_tensors, batch_first=True, padding_value=self.vocab['<pad>'])
        return images, caption_tensors