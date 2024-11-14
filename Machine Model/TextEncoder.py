import torch.nn as nn

class TextEncoder(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim):
        super(TextEncoder, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.gru = nn.GRU(embedding_dim, hidden_dim, batch_first=True)
    def forward(self, input_text):
        embedded = self.embedding(input_text)
        _, hidden = self.gru(embedded)
        return hidden.squeeze(0)
    