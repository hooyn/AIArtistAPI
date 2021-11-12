#!/usr/bin/env python
# coding: utf-8

# In[165]:


import torch
import torchvision
from PIL import Image
from PIL import Image, ImageOps, ImageFilter
from torchvision import transforms as T
import numpy as np
import requests
from io import BytesIO
from IPython import get_ipython
from IPython.display import set_matplotlib_formats

# In[156]:


# 모델 따오기
model = torchvision.models.detection.maskrcnn_resnet50_fpn(pretrained=True)
model.eval()

path ='https://firebasestorage.googleapis.com/v0/b/epoch-7c08e.appspot.com/o/hoho%2FcontentImage%2Fhohoho.png?alt=media&token=ba77559e-599b-4815-b912-c1e373372f6e'


# In[157]:


COCO_INSTANCE_CATEGORY_NAMES = [
    '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
    'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'N/A', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'N/A', 'backpack', 'umbrella', 'N/A', 'N/A',
    'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'N/A', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'N/A', 'dining table',
    'N/A', 'N/A', 'toilet', 'N/A', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'N/A', 'book',
    'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]
# 검출할 수 있는 객체들

len(COCO_INSTANCE_CATEGORY_NAMES) # 91개의 클래스(배경 포함)


# In[ ]:





# In[158]:


def get_prediction(img_path, threshold=0.5, url=True):
    if url: #
        response = requests.get(img_path) #URL 주소로 요청 전송 후 RESOPONSE를 리턴한다., LOCAL이미지 아니면 이거 해야됨 
        img = Image.open(BytesIO(response.content)).convert('RGB')
        
    else:
        img = Image.open(img_path).convert('RGB') # 로칼 이미지면 이래됨
        
    transform = T.Compose([T.ToTensor()]) # 이미지를 TORCH.TENSOR로 바꾸는 도구
    img = transform(img)#툴로 IMG바꾸기
    pred = model([img]) # 이미지를 모델에 돌리고 결과물이 PRED
    # 바운딩박스 지우기
    pred_score = list(pred[0]['scores'].detach().cpu().numpy())#
    pred_t = [pred_score.index(x) for x in pred_score if x > threshold][-1] #임계점 넘으면 저장
    masks = (pred[0]['masks'] > 0.5).squeeze().detach().cpu().numpy()
    masks = masks[:pred_t+1]
    return masks


# In[159]:


import matplotlib.pyplot as plt
#get_ipython().run_line_magic('matplotlib', 'inline')
#get_ipython().run_line_magic('config', "InlineBackend.figure_format = 'retina'")


# In[160]:


import cv2 # opencv
from urllib.request import urlopen
def url_to_image(url, readFlag=cv2.IMREAD_COLOR):
    resp = urlopen(url) #url 이미지를 cv2로 활용하기 위해서
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, readFlag)
    return image


# In[161]:


def white_color_masks(image):

    r = np.zeros_like(image).astype(np.uint8)
    g = np.zeros_like(image).astype(np.uint8)
    b = np.zeros_like(image).astype(np.uint8)
    r[image==1], g[image==1], b[image==1] = [255,255,255]    #걍 무조건 하양색
    colored_mask = np.stack([r,g,b], axis=2)#하얀색 마스크들 저장
    return colored_mask, r


# In[162]:


def instance_segmentation(img_path, threshold, rect_th=4, text_size=1.5, text_th=3, url=True):
    mask_list=[]
    masks = get_prediction(img_path, threshold=threshold, url=url)#mask, pred_boxes, pred_classes
    if url:
        img = url_to_image(img_path) # 만약 url 이미지라면 적용
    else: 
        img = cv2.imread(img_path)#만약 로칼 이미지라면
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # 그냥 bgr을 rgb로 기본값이 bgr인 이유는 없다 ㅋ
    for i in range(len(masks)):#마스크값(이미지 파편)의 수들 만큼 
            rgb_mask, r = white_color_masks(masks[i])# 그림틀을 완성, ex) 사람모양의 파란색 덩어리와 나머지는 흑색 배경
            #DEEPLABV3+ 와는 다르게 이건 딱 정해진거에 한해서만 
            img = cv2.addWeighted(img, 1, rgb_mask, 0, 0)#이미지는 1만큼 존재, 필터는 0.5만큼 존재
            mask_list.append(rgb_mask)# 필터 임시 보관
            
    return img, masks[i], mask_list, rgb_mask, r


# In[ ]:





# In[163]:


thold=0.95
img, masks, mask_list, rgb_mask, r = instance_segmentation(path, threshold=thold, rect_th=1, text_th=2)


# In[ ]:





# In[164]:


img_list=[]
for i in range(len(mask_list)):
    masked = cv2.bitwise_and(img, mask_list[i])
    masked_img = Image.fromarray(masked)
    datas = masked_img.getdata() 
    newData = [] 
    for item in datas: 
        if item[0] == 0 and item[1] == 0 and item[2] == 0: 
            newData.append((255, 255, 255, 0)) 
        else: 
            newData.append(item) 
    
    masked_img.putdata(newData)
    masked_img = masked_img.convert('RGB')
    im_inv = ImageOps.invert(masked_img)

    im_inv_L = im_inv.convert('L')
    # 이미지 픽셀에 투명화 적용
    #alpha = 0(검정): 투명, alpha = 255(흰색): 불투명, 128: 반투명
    
    masked_img.putalpha(im_inv_L)
    masked_img.save('Stay_trans'+str(i)+'.png', "PNG")    
    img_list.append(masked_img)    

print(len(img_list))


# In[ ]:





# 

# In[ ]:





# In[ ]:





# In[ ]:




