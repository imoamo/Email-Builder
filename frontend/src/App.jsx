import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ClipLoader } from 'react-spinners'
import './App.css'

const App = () => {
  const baseURL = 'https://email-builder-backend-v4vr.onrender.com/api/v1'

  const [previewHTML, setPreviewHTML] = useState('')
  const [isTemplateSaved, setIsTemplateSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [templateId, setTemplateId] = useState(null)

  const updatePreview = () => {
    const dynamicHTML = `
      <!DOCTYPE html>
      <html>
        <head>

          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .content {
              font-size: ${formData.contentFontSize}px;
              color: ${formData.contentColor};
              text-align: ${formData.contentAlignment};
            }
            .footer {
              text-align: ${formData.footerAlignment};
              font-size: ${formData.footerFontSize}px;
              color: ${formData.footerColor};
              padding-top: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>${formData.name}</h1>
            <div class="content">
              <p>${formData.contentText}</p>
            </div>
            <div>
              ${imageURL ? `<img src="${imageURL}" alt="Uploaded Image" />` : '<p>No image available</p>'}
            </div>
            <div class="footer">
              <p>${formData.footerText}</p>
            </div>
          </div>
        </body>
      </html>
    `
    setPreviewHTML(dynamicHTML)
  }


  const [formData, setFormData] = useState({
    name: '',
    contentText: '',
    contentColor: '#000000',
    contentFontSize: 16,
    contentAlignment: 'left',
    footerText: '',
    footerColor: '#888888',
    footerFontSize: 12,
    footerAlignment: 'center',
    image: null,
  })
  const [imageURL, setImageURL] = useState('')

  const updateColor = (field, color) => {
    setFormData((prev) => ({
      ...prev,
      [field]: color.hex,
    }))
  }

  useEffect(() => {
    const fetchLayout = async () => {

      try {
        const response = await fetch(`${baseURL}/getEmailLayout`)
        if (!response.ok) throw new Error(`Failed to fetch layout: ${response.status}`)
      } catch (error) {
        console.error(error)
        toast.error('Error fetching email layout.')
      }
    }
    fetchLayout()
    updatePreview()
  }, [baseURL, formData, imageURL]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const uploadFormData = new FormData()
    uploadFormData.append('url', file)
    setLoading(true)

    try {
      const response = await fetch(`${baseURL}/uploadImage`, {
        method: 'POST',
        body: uploadFormData,
      })

      const result = await response.json()
      if (response.ok) {
        setImageURL(result.imageUrl)
        setFormData({ ...formData, imageId: result.imageId })
        toast.success('Image uploaded successfully!')
      } else {
        toast.error('Failed to upload image.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error uploading image.')
    } finally {
      setLoading(false)
    }
  }

  const saveTemplateConfig = async () => {
    const payload = {
      name: formData.name,
      content: {
        text: formData.contentText,
        styles: {
          color: formData.contentColor,
          fontSize: `${formData.contentFontSize}px`,
          alignment: formData.contentAlignment,
        },
      },
      footer: {
        text: formData.footerText,
        styles: {
          color: formData.footerColor,
          fontSize: `${formData.footerFontSize}px`,
          alignment: formData.footerAlignment,
        },
      },
      imageId: formData.imageId,
    }

    console.log('Payload:', payload)
    setLoading(true)
    try {
      const response = await fetch(`${baseURL}/uploadEmailConfig`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Error saving template: ${response.status}`)
      const data = await response.json()
      toast.success('Template saved successfully!')
      console.log('Template ID:', data.templateId)
      setTemplateId(data.templateId);
      setIsTemplateSaved(true)
    } catch (error) {
      console.error(error)
      toast.error('Error saving template.')
    } finally {
      setLoading(false)
    }
  }

  const renderAndDownloadTemplate = async (templateId) => {
    setLoading(true)
    try {
      const response = await fetch(`${baseURL}/renderAndDownloadTemplate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      if (!response.ok) throw new Error(`Error rendering template: ${response.status}`)

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'template.html'
      link.click()
      toast.success('Template downloaded successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Error downloading template.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='App'>
      <h1 style={{textAlign: 'center'}}>Email Builder</h1>
      {loading && (
        <div className='loading-overlay'>
          <ClipLoader color='#4A90E2' size={50} />
        </div>
      )}

      <div className='parent'>
        <div className='card'>
          <h2>View Layout</h2>
          <h3>Enter data in fields to see the preview</h3>
          <div className='dangerously-set-html' dangerouslySetInnerHTML={{ __html: previewHTML }}></div>
        </div>

        <div className='card'>
          <h2>Customize Template</h2>
          <label>Name:</label>
          <input type='text' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

          <label>Content Text:</label>
          <textarea value={formData.contentText} onChange={(e) => setFormData({ ...formData, contentText: e.target.value })} />

          <label>Content Color:</label>
          <HexColorPicker color={formData.contentColor} onChange={(color) => updateColor('contentColor', { hex: color })} />

          <div style={{marginTop:'20px'}}>
          <label>Font Size:</label>
          <input type='number' value={formData.contentFontSize} onChange={(e) => setFormData({ ...formData, contentFontSize: e.target.value })} />
          </div>
          <div className='card'>
            <h2>Upload Image</h2>
            <input type='file' onChange={handleImageUpload} />
          </div>
        </div>

        <div className='container'>
          <button
            onClick={saveTemplateConfig}
            disabled={!formData.name || !formData.contentText}
            data-tooltip-id='my-tooltip'
            data-tooltip-content='Fill in the fields and click to save the template'
          >
            Save Template
          </button>
          <button
            onClick={() => renderAndDownloadTemplate(templateId)}
            disabled={!isTemplateSaved}
            data-tooltip-id='my-tooltip'
            data-tooltip-content='Save the template first to enable this button'
          >
            Render & Download Template
          </button>
        </div>
      </div>

      <footer>
        <p>
          Created by <a href='#'>Md Imran</a> | © {new Date().getFullYear()}
        </p>
      </footer>

      <ToastContainer />
      <Tooltip id='my-tooltip' />
    </div>
  )
}

export default App
