import express from "express";
import exphbs from "express-handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import upload from "../middlewares/multer.js";
import { EmailTemplate } from "../models/emailTemplate.model.js";
import { UploadedImage } from "../models/uploadedImage.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getDataUri } from "../utils/dataUri.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/getEmailLayout', (_, res) => {
  res.render('layout');  // This will render layout.handlebars from the views folder
});

router.post('/uploadImage', upload.single('url'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUri = getDataUri(req.file);

    const result = await cloudinary.uploader.upload(fileUri);

    const newImage = new UploadedImage({
      url: result.secure_url,
    });

    await newImage.save();

    res.status(200).json({ imageUrl: result.secure_url, imageId: newImage._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});


router.post('/uploadEmailConfig', async (req, res) => {
  try {
    const { name, content, footer, imageId } = req.body;

    let imageReference = null;
    if (imageId) {
      const image = await UploadedImage.findById(imageId);
      if (image) {
        imageReference = image._id;
      } else {
        return res.status(400).json({ error: 'Invalid image ID' });
      }
    }

    const newTemplate = new EmailTemplate({
      name,
      content,
      footer,
      image: imageReference,
    });


    await newTemplate.save();


    if (imageReference) {
      await UploadedImage.findByIdAndUpdate(imageReference, {
        associatedTemplate: newTemplate._id,
      });
    }

    res.status(200).json({ message: 'Email config saved successfully', templateId: newTemplate._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving email config' });
  }
});


router.post('/renderAndDownloadTemplate', async (req, res) => {
  try {
    const { templateId } = req.body;

    // Fetch the template from the database
    const template = await EmailTemplate.findById(templateId).populate('image');
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const hbs = exphbs.create({
      extname: '.handlebars',
      defaultLayout: 'main',
    });

    // Ensure the correct file path to layout.handlebars
    const layoutFilePath = path.join(__dirname, '../views', 'layout.handlebars');
    console.log('Layout file path:', layoutFilePath); // Log the file path

    const layoutTemplate = fs.readFileSync(layoutFilePath, 'utf8');

    // Prepare dynamic data for rendering
    const dynamicData = {
      name: template.name || '',
      contentText: template.content.text || '',
      contentColor: template.content.styles.color || '',
      contentFontSize: template.content.styles.fontSize || '',
      contentAlignment: template.content.styles.alignment || '',
      footerText: template.footer.text || '',
      footerColor: template.footer.styles.color || '',
      footerFontSize: template.footer.styles.fontSize || '',
      footerAlignment: template.footer.styles.alignment || '',
      image: template.image ? template.image.url : null,
    };

    // Log dynamic data to ensure it's being populated
    console.log('Dynamic data:', dynamicData);

    // Compile and render the template
    const templateCompiled = hbs.handlebars.compile(layoutTemplate);
    const html = templateCompiled(dynamicData);

    // Send the rendered HTML as the response
    res.setHeader('Content-disposition', 'attachment; filename=template.html');
    res.setHeader('Content-type', 'text/html');
    return res.send(html); // Send the rendered HTML as a downloadable file
  } catch (error) {
    console.error('Error rendering template:', error);
    return res.status(500).json({ error: 'Error rendering the template' });
  }
});




export default router;