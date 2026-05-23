import { createClient } from '@supabase/supabase-js';

/**
 * Uploads a file to Supabase storage if credentials are provided,
 * otherwise falls back to generating a local browser Object URL.
 * 
 * @param {File} file - The file object to upload
 * @param {Object} config - The Supabase configuration object { supabaseUrl, supabaseKey, bucketName }
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export const uploadFile = async (file, config) => {
  const { supabaseUrl, supabaseKey, bucketName } = config;

  // Fallback to local mock upload if Supabase is not configured
  if (!supabaseUrl || !supabaseKey || !bucketName) {
    console.log('Supabase not configured, using simulated local browser upload.');
    return new Promise((resolve) => {
      // Create a local object URL that lasts for the current browser session
      const objectUrl = URL.createObjectURL(file);
      setTimeout(() => {
        resolve(objectUrl);
      }, 1500); // Simulate network latency
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file to Supabase storage:', error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Tests connection to a Supabase bucket
 * 
 * @param {Object} config - { supabaseUrl, supabaseKey, bucketName }
 * @returns {Promise<boolean>} True if successful connection, throws error otherwise
 */
export const testCloudConnection = async (config) => {
  const { supabaseUrl, supabaseKey, bucketName } = config;
  if (!supabaseUrl || !supabaseKey || !bucketName) {
    throw new Error('All configuration fields (URL, Key, Bucket Name) are required.');
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Attempt to list files from the bucket to verify access
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw new Error(`Connection test failed: ${error.message}`);
  }
};
