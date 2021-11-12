import functools
import matplotlib.pylab as plt
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import sys
import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

"""여기에 Input url 넣으면 됩니다"""
Content_URL = sys.argv[1]
Style_URL = sys.argv[2]

userID = sys.argv[3]
random = sys.argv[4]


""" 아래부터는 안건드려도 됩니당"""
path = '/home/ubuntu/python/source'
content_image_url = tf.keras.utils.get_file(path + '/contentName'+ userID + random + '.jpg', Content_URL)
style_image_url = tf.keras.utils.get_file(path+ '/styleName'+ userID + random + '.jpg', Style_URL)

output_image_size = 1024
content_img_size = (output_image_size, output_image_size)
style_img_size = (1024, 1024)

def crop_center(image):

  shape = image.shape
  new_shape = min(shape[1], shape[2])
  offset_y = max(shape[1] - shape[2], 0) // 2
  offset_x = max(shape[2] - shape[1], 0) // 2
  image = tf.image.crop_to_bounding_box(
      image, offset_y, offset_x, new_shape, new_shape)
  return image

@functools.lru_cache(maxsize=None)
def load_image(image_url, image_size=(256, 256), preserve_aspect_ratio=True):
  img = plt.imread(image_url).astype(np.float32)[np.newaxis, ...]
  if img.max() > 1.0:
    img = img / 255.
  if len(img.shape) == 3:
    img = tf.stack([img, img, img], axis=-1)
  img = crop_center(img)
  img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)
  return img

content_image = load_image(content_image_url, content_img_size)
style_image = load_image(style_image_url, style_img_size)
style_image = tf.nn.avg_pool(style_image, ksize=[3,3], strides=[1,1], padding='SAME')

hub_handle = 'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
hub_module = hub.load(hub_handle)

outputs = hub_module(tf.constant(content_image), tf.constant(style_image))
stylized_image = outputs[0]

plt.imshow(stylized_image[0])
plt.axis('off')
plt.savefig('/home/ubuntu/image/' + userID + '/result' + random + '.png')