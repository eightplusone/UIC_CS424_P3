#Text Annotation Graph#
**by Aditi Mallavarapu, Aryadip Sarkar and Hai Tran**

This project is a part of CS 424 course, "Visualization & Visual Analytics" at University of Illinois at Chicago.

**1. Context**
We are getting closer to the era of computers being able to understand humans' writings comprehensively. Many Natural Language Processing (NLP) products have been able to make a casual conversation with us. However, scientists want to take NLP to another level, where computers can read and understand technical articles such as biological articles or chemistry research paper. In order to achieve that goal, NLP analysts need a visualization tool to analyze their data and their experiments.

**2. Existing Tools**
Two existing tools that we know of are BRAT (+ its predecessor STAV) and Odin Open Domain Rule Visualizer. Both tools are fairly new for public use (BRAT was published in 2012 and Odin was 2015), therefore they have not yet optimized for NLP researchers. There are a few problems that we can see:
- Lack of features
Although BRAT comes with a plenty of functionalities, it only supports node-to-node connections. We plan to support node-to-edge, edge-to-node, and edge-to-edge connections as well.

- User Interface is not intuitive
One of BRAT’s problems is to identify two ends of a connection. Scientists usually encounter this problem when the connection spans over many lines of text while no interaction is given to jump to the ends quickly. 

**3. Our Analysis**
Order is important in a text document. If we swap positions of two words, two sentences, or two paragraphs, the new document will be entirely different. Therefore, we need to find a visualization technique that can maintain these orders.
In addition, we need to help users move around more quickly and easily. This depends of which visualization we are going to use.

**4. Prototype**
![Overview](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/lorem-01.png)