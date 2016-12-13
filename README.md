#Text Annotation Graph#
**by Aditi Mallavarapu, Aryadip Sarkar and Hai Tran**

This project is a part of CS 424 course, _"Visualization & Visual Analytics"_ at University of Illinois at Chicago.

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
This project is still in progress. Below we will present the prototype that we have. Since we did not have real life data, the text was generated using [lipsum.com](http://lipsum.com)

- Overview:

![Overview](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/lorem-01.png)

We think it is a great idea to provide more than one visualizations so we can apply more visualization techniques and users can gain more perspectives. We decide to use two visualizations: the left one uses the traditional approach of displaying text in paragraphs, and right one is a graph which looks like a staircase. For the staircase, we also have a minimap and two zoom buttons for navigation (more details will be described in the next few slides).

The edges and labels are color coded for an easier recognition.

By default, when we load data, the staircase will display the document at paragraph level. The five square blocks that we see in the picture correspond to five paragraphs that we have in the document. The dotted lines indicate cross-paragraph connections. 

- User can hover on a label to see details of the connection

![Hover](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/gonzo-02.png)

- The dropdown list contains all annotations that have been defined in the dataset. When one label is unchecked, all connections with that label will turn from color to gray.

![Categories](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/gonzo-06.png)

- The same effect is applied when one or more of the five color lines is clicked.

![Lines](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/gonzo-07.png)

- When we zoom in (by clicking the “+” button), sentences, words, and edges will start appearing inside the 5 initial blocks. If we click on a sentence on the left hand side, that sentence will appear on the right visualization and fill up the entire view frame. 

Notice that the minimap updated according to our current position within the document. User can move around by dragging the red square in minimap.

![Minimap1](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/lorem-02.png)

Any connection that links the selected sentence with another sentence/paragraph will be represented using dotted lines. When we click on the dotted square, the graph will be animated and centered at that word.

With this minimap, navigation is no longer a problem. 

![Minimap2](https://github.com/eightplusone/UIC_CS424_P3/blob/master/design%20guidelines/screen/lorem-03.png)

**5. References**
- [BRAT rapid annotation tool](http://brat.nlplab.org/)
- [Odin Open Domain Rule Visualizer](http://agathon.sista.arizona.edu:8080/odinweb/open/enterRules)
