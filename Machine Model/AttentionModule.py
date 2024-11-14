import torch.nn as nn #type: ignore
import torch #type: ignore


class AttentionModule(nn.Module):
    def __init__(self, feature_dim, text_feature_dim, attention_dim):
        super(AttentionModule, self).__init__()
        self.adjust_text_features = nn.Linear(text_feature_dim, feature_dim)
        self.attention_layer = nn.Sequential(
            nn.Linear(262144, attention_dim),
            nn.Tanh(),
            nn.Linear(attention_dim, feature_dim * 16 * 16),
            nn.Softmax(dim=1)
        )
    def forward(self, features, text_features):
        text_features_adjusted = self.adjust_text_features(text_features).unsqueeze(-1).unsqueeze(-1)
        text_features_expanded = text_features_adjusted.expand(-1, -1, features.size(2), features.size(3))
        combined_features = torch.cat((features, text_features_expanded), dim=1)
        combined_features_flat = combined_features.view(combined_features.size(0), -1)
        attention_weights = self.attention_layer(combined_features_flat)
        attended_features = attention_weights.view(features.size(0), features.size(1), features.size(2), features.size(3))
        attended_features = attended_features * features
        return attended_features