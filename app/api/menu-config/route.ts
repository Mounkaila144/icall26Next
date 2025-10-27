import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'public', 'data', 'menu-configuration.json');

// Ensure data directory and file exist
const ensureConfigFile = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = {
      version: '1.0',
      lastUpdated: null,
      menus: {}
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  }
};

// Read configuration
const readConfig = () => {
  ensureConfigFile();

  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading menu configuration:', error);
    return {
      version: '1.0',
      lastUpdated: null,
      menus: {}
    };
  }
};

// Write configuration
const writeConfig = (config: any) => {
  ensureConfigFile();

  try {
    config.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing menu configuration:', error);
    return false;
  }
};

// GET - Read menu configuration
export async function GET() {
  try {
    const config = readConfig();
    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('GET /api/menu-config error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read configuration'
      },
      { status: 500 }
    );
  }
}

// POST - Update menu configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request
    if (!body.menus || typeof body.menus !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid configuration format'
        },
        { status: 400 }
      );
    }

    const config = {
      version: '1.0',
      menus: body.menus,
      lastUpdated: null // Will be set by writeConfig
    };

    const success = writeConfig(config);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Configuration saved successfully',
        data: {
          ...config,
          lastUpdated: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save configuration'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST /api/menu-config error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update configuration'
      },
      { status: 500 }
    );
  }
}

// DELETE - Reset configuration
export async function DELETE() {
  try {
    const defaultConfig = {
      version: '1.0',
      lastUpdated: null,
      menus: {}
    };

    const success = writeConfig(defaultConfig);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Configuration reset successfully',
        data: defaultConfig
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to reset configuration'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('DELETE /api/menu-config error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset configuration'
      },
      { status: 500 }
    );
  }
}
